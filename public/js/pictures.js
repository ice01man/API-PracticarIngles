// pictures.js
// Juegos con imágenes (los ejercicios originales del proyecto).

import { $, $$, esc, api, render, confetti, praise } from './ui.js';
import { runQuiz } from './quiz.js';
import { checkAnswer, shuffle } from './answers.js';
import { speak, sfx } from './sound.js';
import { store } from './store.js';

export async function picturesList() {
  const games = await api('/api/picture-games');
  render(`
    <section>
      <a href="#/home" class="link-back">← Inicio</a>
      <h1 class="page-title">Juegos con imágenes</h1>
      <p class="lead">Mirá, leé y respondé. ¡Ideal para empezar!</p>
      <div class="tiles">
        ${games.map((g) => `
          <a class="tile" href="#/pictures/${g.id}">
            <span class="tile-emoji">${g.emoji}</span>
            <b>${esc(g.title)}</b>
            <span>${esc(g.subtitle)}</span>
          </a>`).join('')}
      </div>
    </section>`);
}

export async function pictureGame(id) {
  const games = await api('/api/picture-games');
  const game = games.find((g) => g.id === id);
  if (!game) { location.hash = '#/pictures'; return; }
  const back = '#/pictures';

  if (game.type === 'story') return storyGame(game);

  const yesNo = (q, labels) => ({
    kind: 'choice',
    keepOrder: true,
    image: q.image || game.image,
    prompt: esc(q.text),
    options: labels,
    answers: [q.answer ? labels[0] : labels[1]],
    show: q.correct || (q.answer ? labels[0] : labels[1]),
    speakPrompt: q.text,
    speak: q.text,
    autoSpeak: true,
    explain: q.correct ? esc(q.correct) : '',
    review: esc(q.text),
  });

  let questions;
  if (game.type === 'tick') questions = game.questions.map((q) => yesNo(q, ['✔ Yes', '✘ No']));
  if (game.type === 'yesno') questions = game.questions.map((q) => yesNo(q, ['Yes', 'No']));
  if (game.type === 'spell') {
    questions = game.questions.map((q) => ({
      kind: 'input', image: q.image, prompt: '¿Qué es? Escribilo en inglés', answers: [q.answer], speak: q.answer, review: '🖼️',
    }));
  }
  if (game.type === 'letters') {
    questions = game.questions.map((q) => ({
      kind: 'input',
      image: q.image,
      prompt: 'Ordená las letras:',
      sub: `<span class="scrambled">${shuffle([...q.answer]).join(' ')}</span>`,
      answers: [q.answer],
      speak: q.answer,
      review: '🍽️',
    }));
  }
  const cfg = { title: game.title, back, questions: shuffle(questions) };
  cfg.restart = () => pictureGame(id);
  runQuiz(cfg);
}

// Texto para completar con un banco de palabras (Mi primo Nick).
function storyGame(game) {
  const blanks = game.parts.filter((p) => p.blank).map((p) => p.blank);
  render(`
    <section>
      <a href="#/pictures" class="link-back">← Juegos</a>
      <h1 class="page-title">${game.emoji} ${esc(game.title)}</h1>
      <p class="lead">${esc(game.subtitle)}. Tocá una palabra y después tocá el espacio en blanco.</p>
      <div class="story-layout">
        <img class="story-img" src="${esc(game.images[0])}" alt="Nick, el primo">
        <div class="card">
          <div class="word-bank" id="bank">
            ${shuffle(game.words).map((w) => `<button class="chip" data-w="${esc(w)}">${esc(w)}</button>`).join('')}
          </div>
          <p class="story" id="story">
            ${game.parts
              .map((p, i) => `${esc(p.text)}${p.blank ? ` <button class="slot" data-i="${i}" aria-label="Espacio ${i + 1}">______</button>` : ''}`)
              .reduce((acc, cur) => acc + (/^[.,!?]/.test(cur) ? '' : ' ') + cur)}
          </p>
          <div class="row"><button class="btn" id="listen">🔊 Escuchar</button><button class="btn btn-primary" id="check">Comprobar</button></div>
          <div class="feedback" id="feedback" aria-live="polite"></div>
        </div>
      </div>
      <img class="story-img wide" src="${esc(game.images[1])}" alt="Palabras con dibujos: brothers, pear, piano, jeans, television, playground, helicopter, ice creams">
    </section>`);

  let picked = null;
  $$('#bank .chip').forEach((c) => {
    c.onclick = () => {
      $$('#bank .chip').forEach((x) => x.classList.remove('picked'));
      picked = c.dataset.w;
      c.classList.add('picked');
      speak(picked);
    };
  });
  $$('.slot').forEach((s) => {
    s.onclick = () => {
      if (s.disabled) return;
      if (picked) {
        s.textContent = picked; s.dataset.value = picked; s.classList.add('filled'); s.classList.remove('slot-bad');
        picked = null;
        $$('#bank .chip').forEach((x) => x.classList.remove('picked'));
      }
      else if (s.dataset.value) { s.textContent = '______'; delete s.dataset.value; s.classList.remove('filled'); }
    };
  });
  $('#listen').onclick = () => speak(game.parts.map((p) => `${p.text} ${p.blank || ''}`).join(' '));
  $('#check').onclick = () => {
    let ok = 0;
    $$('.slot').forEach((s) => {
      const right = game.parts[s.dataset.i].blank;
      const good = checkAnswer(s.dataset.value || '', [right]);
      s.classList.toggle('slot-ok', good);
      s.classList.toggle('slot-bad', !good && !!s.dataset.value);
      if (good) { ok++; s.disabled = true; }
    });
    if (ok === blanks.length) {
      store.addStars(blanks.length);
      sfx.win();
      confetti();
      $('#feedback').innerHTML = `<p class="fb fb-ok">${praise()} ¡Completaste todo el texto! ⭐ +${blanks.length}</p>`;
    } else {
      sfx.bad();
      $('#feedback').innerHTML = `<p class="fb fb-bad">Tenés ${ok} de ${blanks.length} bien. Cambiá las rojas y probá otra vez.</p>`;
    }
  };
}
