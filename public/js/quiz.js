// quiz.js
// Motor de preguntas que usan todos los juegos.
//
// Cada pregunta es un objeto:
//   kind:      'choice' (elegir), 'input' (escribir) u 'order' (ordenar palabras)
//   prompt:    texto o HTML de la pregunta (ya escapado)
//   sub:       texto chico de ayuda (opcional)
//   emoji / image: decoración (opcional)
//   options:   opciones (choice) o palabras (order)
//   answers:   respuestas válidas (lista)
//   show:      cómo mostrar la respuesta correcta si se equivoca (opcional)
//   speakPrompt: texto para el botón 🔊 antes de responder (no debe revelar la respuesta)
//   speak:     texto en inglés que se escucha después de responder (opcional)
//   explain:   explicación corta después de responder (opcional)
//   onResult:  función(correcto) para guardar progreso (opcional)

import { $, $$, esc, render, modal, confetti, isKids, praise, retryMsg } from './ui.js';
import { checkAnswer, shuffle } from './answers.js';
import { speak, canSpeak, sfx } from './sound.js';
import { store } from './store.js';

export function runQuiz(config) {
  const { title, back = '#/home', timed = 0 } = config;
  const questions = config.questions ? [...config.questions] : [];
  let index = 0;
  let correctCount = 0;
  let answeredCount = 0;
  const mistakes = [];
  let timerId = null;
  let timeLeft = timed;
  let finished = false;

  function current() {
    if (timed) {
      if (index >= questions.length) questions.push(config.next());
    }
    return questions[index];
  }

  function header() {
    const total = timed ? null : questions.length;
    const pct = total ? Math.round((index / total) * 100) : 0;
    return `
      <div class="quiz-head">
        <a href="${back}" class="link-back" id="quit">← Salir</a>
        <h1 class="quiz-title">${esc(title)}</h1>
        ${timed
          ? `<div class="timer" id="timer">⏱️ <b>${timeLeft}</b>s · ✓ <b id="score">${correctCount}</b></div>`
          : `<div class="counter">${index + 1} / ${total}</div>`}
      </div>
      ${timed ? `<div class="bar"><span id="timebar" style="width:${(timeLeft / timed) * 100}%"></span></div>`
              : `<div class="bar"><span style="width:${pct}%"></span></div>`}`;
  }

  function show() {
    if (finished) return;
    const q = current();
    const speakBtn = q.speakPrompt && canSpeak() ? `<button class="icon-btn speak" id="speak" aria-label="Escuchar">🔊</button>` : '';
    let body = '';

    if (q.kind === 'choice') {
      const opts = q.keepOrder ? q.options : shuffle(q.options);
      body = `<div class="options ${opts.length > 3 ? 'grid-2' : ''}">
        ${opts.map((o, i) => `<button class="option" data-value="${esc(o)}"><span class="key">${i + 1}</span>${esc(o)}</button>`).join('')}
      </div>`;
    } else if (q.kind === 'input') {
      const len = q.answers[0].length;
      body = `
        <form class="answer-form" id="answer-form" autocomplete="off">
          ${isKids() && q.letterHint !== false ? `<div class="letters" id="letters">${'_ '.repeat(len).trim()}</div>` : ''}
          <input id="answer" class="answer-input" type="text" inputmode="text" autocapitalize="off" spellcheck="false"
                 placeholder="Escribí acá…" aria-label="Tu respuesta" />
          <div class="row">
            <button type="button" class="btn" id="hint">💡 Pista</button>
            <button type="submit" class="btn btn-primary">Comprobar</button>
          </div>
        </form>`;
    } else if (q.kind === 'order') {
      body = `
        <div class="order-target" id="target" aria-label="Tu oración"></div>
        <div class="order-pool" id="pool">
          ${shuffle(q.options).map((w) => `<button class="chip" data-w="${esc(w)}">${esc(w)}</button>`).join('')}
        </div>
        <div class="row"><button class="btn" id="clear">Borrar</button><button class="btn btn-primary" id="check">Comprobar</button></div>`;
    }

    render(`
      <section class="quiz">
        ${header()}
        <div class="card question-card">
          ${q.image ? `<img class="q-image" src="${esc(q.image)}" alt="">` : ''}
          ${q.emoji ? `<div class="q-emoji" aria-hidden="true">${q.emoji}</div>` : ''}
          <div class="q-prompt">${q.prompt} ${speakBtn}</div>
          ${q.sub ? `<div class="q-sub">${q.sub}</div>` : ''}
          ${body}
          <div class="feedback" id="feedback" aria-live="polite"></div>
        </div>
      </section>`);

    $('#quit').onclick = (e) => {
      e.preventDefault();
      stopTimer();
      finished = true;
      if (location.hash === back) window.dispatchEvent(new HashChangeEvent('hashchange'));
      else location.hash = back;
    };
    $('#speak')?.addEventListener('click', () => speak(q.speakPrompt));
    if (q.speakPrompt && q.autoSpeak) setTimeout(() => speak(q.speakPrompt), 250);

    if (q.kind === 'choice') bindChoice(q);
    if (q.kind === 'input') bindInput(q);
    if (q.kind === 'order') bindOrder(q);
  }

  function bindChoice(q) {
    const buttons = $$('.option');
    buttons.forEach((b) => { b.onclick = () => answer(q, b.dataset.value, b); });
    document.onkeydown = (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= buttons.length && !buttons[0].disabled) buttons[n - 1].click();
    };
  }

  function bindInput(q) {
    const input = $('#answer');
    let attempts = 0;
    let hintLevel = 0;
    input.focus();
    input.oninput = () => {
      const letters = $('#letters');
      if (!letters) return;
      const target = q.answers[0];
      letters.textContent = [...target].map((ch, i) => (input.value[i]?.toLowerCase() === ch.toLowerCase() ? ch : '_')).join(' ');
    };
    $('#hint').onclick = () => {
      hintLevel = Math.min(hintLevel + 1, q.answers[0].length - 1);
      input.value = q.answers[0].slice(0, hintLevel);
      input.oninput();
      input.focus();
    };
    $('#answer-form').onsubmit = (e) => {
      e.preventDefault();
      if (!input.value.trim()) return;
      const ok = checkAnswer(input.value, q.answers);
      attempts++;
      // Primer error: una segunda oportunidad (sin timer). Segundo error: mostramos la respuesta.
      if (!ok && attempts === 1 && !timed) {
        sfx.bad();
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 400);
        $('#feedback').innerHTML = `<p class="fb-retry">${retryMsg()} Tenés otro intento.</p>`;
        if (hintLevel === 0) $('#hint').click();
        return;
      }
      answer(q, input.value, null, ok, attempts === 1 && hintLevel === 0);
    };
  }

  function bindOrder(q) {
    const target = $('#target');
    const pool = $('#pool');
    const move = (chip) => {
      (chip.parentElement === pool ? target : pool).appendChild(chip);
    };
    $$('.chip').forEach((c) => { c.onclick = () => move(c); });
    $('#clear').onclick = () => $$('.chip', target).forEach((c) => pool.appendChild(c));
    $('#check').onclick = () => {
      const sentence = $$('.chip', target).map((c) => c.dataset.w).join(' ');
      if (!sentence) return;
      answer(q, sentence);
    };
  }

  function answer(q, value, button, forcedOk, firstTry = true) {
    const ok = forcedOk ?? checkAnswer(value, q.answers);
    answeredCount++;
    if (ok) correctCount++;
    else mistakes.push(q);
    q.onResult?.(ok && firstTry);
    if (ok) store.addStars(1);

    // Bloquear controles
    $$('.option, .chip, #answer, #hint, #check, #clear, .answer-form button').forEach((el) => { el.disabled = true; });
    if (q.kind === 'choice') {
      $$('.option').forEach((b) => {
        if (checkAnswer(b.dataset.value, q.answers)) b.classList.add('is-correct');
      });
      if (!ok && button) button.classList.add('is-wrong');
    }

    const correctText = q.show || q.answers[0];
    if (ok) sfx.ok(); else sfx.bad();

    if (timed) {
      $('#feedback').innerHTML = ok ? `<p class="fb-ok">✓</p>` : `<p class="fb-bad">→ ${esc(correctText)}</p>`;
      setTimeout(() => { index++; show(); }, ok ? 350 : 1100);
      return;
    }

    $('#feedback').innerHTML = `
      <div class="fb ${ok ? 'fb-ok' : 'fb-bad'}">
        <p class="fb-title">${ok ? praise() : 'La respuesta es:'} ${ok ? '' : `<b>${esc(correctText)}</b>`}</p>
        ${q.explain ? `<p class="fb-explain">${q.explain}</p>` : ''}
        <div class="row">
          ${q.speak && canSpeak() ? '<button class="btn" id="fb-speak">🔊 Escuchar</button>' : ''}
          <button class="btn btn-primary" id="next">${index + 1 < questions.length ? 'Siguiente →' : 'Ver resultado'}</button>
        </div>
      </div>`;
    if (q.speak && !ok) speak(q.speak);
    $('#fb-speak')?.addEventListener('click', () => speak(q.speak));
    const next = $('#next');
    next.focus();
    next.onclick = () => { index++; index < questions.length ? show() : finish(); };
    document.onkeydown = null;
  }

  function stopTimer() { clearInterval(timerId); timerId = null; }

  function finish() {
    if (finished) return;
    finished = true;
    stopTimer();
    document.onkeydown = null;
    const total = timed ? answeredCount : questions.length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    config.onFinish?.({ correct: correctCount, total, pct });
    const record = timed ? store.recordBest60(correctCount) : false;
    const great = timed ? correctCount >= 10 : pct >= 80;
    if (great) { confetti(); sfx.win(); }

    const medal = pct === 100 ? '🏆' : pct >= 80 ? '🥇' : pct >= 50 ? '🥈' : '💪';
    const msg = timed
      ? (record ? '¡Nuevo récord!' : `Tu récord: ${store.current.best60}`)
      : pct === 100 ? '¡Perfecto!' : pct >= 80 ? '¡Muy bien!' : pct >= 50 ? '¡Vas bien! Repasá los errores.' : 'Practicando se aprende. ¡Otra vez!';

    render(`
      <section class="quiz">
        <div class="card result-card">
          <div class="medal" aria-hidden="true">${medal}</div>
          <h1>${msg}</h1>
          <p class="big-score">${correctCount} <span>/ ${total}</span></p>
          <p class="muted">Ganaste ⭐ ${correctCount} estrellas</p>
          ${mistakes.length ? `
            <div class="mistakes">
              <h2>Para repasar</h2>
              <ul>${mistakes.map((m) => `<li><span>${m.review || m.prompt}</span> <b>→ ${esc(m.show || m.answers[0])}</b></li>`).join('')}</ul>
            </div>` : ''}
          <div class="row wrap">
            ${mistakes.length && !timed ? '<button class="btn btn-primary" id="redo-mistakes">Repasar errores</button>' : ''}
            <button class="btn ${mistakes.length && !timed ? '' : 'btn-primary'}" id="again">Jugar otra vez</button>
            <a class="btn" href="${back}">Volver</a>
          </div>
        </div>
      </section>`);
    $('#again').onclick = () => (config.restart ? config.restart() : runQuiz(config));
    $('#redo-mistakes')?.addEventListener('click', () => runQuiz({ ...config, questions: mistakes, next: undefined, timed: 0, title: `${title} · errores`, restart: null }));
  }

  if (timed) {
    timerId = setInterval(() => {
      timeLeft--;
      const t = $('#timer b');
      if (t) t.textContent = timeLeft;
      const bar = $('#timebar');
      if (bar) bar.style.width = `${(timeLeft / timed) * 100}%`;
      if (timeLeft <= 0) finish();
    }, 1000);
    // Si el usuario se va de la pantalla, cortamos el timer
    window.addEventListener('hashchange', () => { stopTimer(); finished = true; }, { once: true });
  }

  if (!timed && !questions.length) {
    modal('Nada para practicar', '<p>No hay preguntas en este grupo todavía.</p>', [{ label: 'Volver', primary: true, onClick: () => { location.hash = back; } }]);
    return;
  }
  show();
}
