// lessons.js
// Lecciones de gramática armadas con lo visto en clase.

import { $, esc, api, render } from './ui.js';
import { runQuiz } from './quiz.js';
import { shuffle } from './answers.js';
import { store } from './store.js';

export async function lessonsList() {
  const lessons = await api('/api/lessons');
  const done = store.current.lessons;
  render(`
    <section>
      <a href="#/home" class="link-back">← Inicio</a>
      <h1 class="page-title">Lecciones de clase</h1>
      <p class="lead">Cada lección tiene un resumen corto y ejercicios para practicar.</p>
      <div class="tiles">
        ${lessons.map((l) => `
          <a class="tile" href="#/lessons/${l.id}">
            <span class="tile-emoji">${l.emoji}</span>
            <small class="tag">${esc(l.unit)}</small>
            <b>${esc(l.title)}</b>
            <span>${esc(l.subtitle)}</span>
            ${done[l.id] != null ? `<span class="score-badge ${done[l.id] >= 80 ? 'good' : ''}">Mejor: ${done[l.id]}%</span>` : ''}
          </a>`).join('')}
      </div>
    </section>`);
}

export async function lessonView(id) {
  const lesson = await api(`/api/lessons/${encodeURIComponent(id)}`);
  render(`
    <section>
      <a href="#/lessons" class="link-back">← Lecciones</a>
      <h1 class="page-title">${lesson.emoji} ${esc(lesson.title)}</h1>
      <p class="lead">${esc(lesson.unit)} · ${esc(lesson.subtitle)}</p>
      <div class="card tips">
        <h2>Recordá</h2>
        <ul>${lesson.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      <p class="center"><button class="btn btn-primary btn-big" id="start">Empezar a practicar (${lesson.exercises.length})</button></p>
    </section>`);
  $('#start').onclick = () => startLesson(lesson);
}

function toQuestion(ex) {
  if (ex.type === 'choice') {
    return { kind: 'choice', prompt: esc(ex.q).replace('___', '<span class="blank">_____</span>'), options: ex.options, answers: [ex.answer], explain: ex.tip ? `💡 ${esc(ex.tip)}` : '', speak: ex.q.replace('___', ex.answer), review: esc(ex.q) };
  }
  if (ex.type === 'fill') {
    return { kind: 'input', letterHint: false, prompt: esc(ex.q).replace('___', '<span class="blank">_____</span>'), answers: ex.answer, explain: ex.tip ? `💡 ${esc(ex.tip)}` : '', speak: ex.q.replace(/\(.*?\)/g, '').replace('___', ex.answer[0]), review: esc(ex.q) };
  }
  // order
  return { kind: 'order', prompt: 'Ordená las palabras', options: ex.words, answers: [ex.answer], show: ex.answer.replace(' ?', '?'), speak: ex.answer, review: esc(ex.words.join(' / ')) };
}

function startLesson(lesson) {
  const cfg = {
    title: lesson.title,
    back: `#/lessons/${lesson.id}`,
    questions: shuffle(lesson.exercises).map(toQuestion),
    onFinish: ({ pct }) => store.recordLesson(lesson.id, pct),
  };
  cfg.restart = () => startLesson(lesson);
  runQuiz(cfg);
}
