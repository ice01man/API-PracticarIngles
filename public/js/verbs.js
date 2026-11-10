// verbs.js
// Todo lo de verbos: grupos, tarjetas, preguntas, lista y verbos regulares.

import { $, $$, esc, api, render, isKids, modal, confetti } from './ui.js';
import { runQuiz } from './quiz.js';
import { shuffle, regularPast, thirdPerson } from './answers.js';
import { speak, canSpeak, sfx } from './sound.js';
import { store } from './store.js';

// Orden para chicos: primero los que vieron en clase (Unit 7), después los más usados.
const KIDS_ORDER = [
  'go', 'have', 'eat', 'see', 'buy', 'make', 'do', 'get', 'take', 'write', 'cut', 'read',
  'come', 'run', 'swim', 'sing', 'fly', 'sleep', 'drink', 'give',
  'find', 'say', 'tell', 'think', 'know', 'ride', 'sit', 'stand',
  'break', 'draw', 'drive', 'fall', 'feel', 'forget', 'win', 'lose',
  'meet', 'put', 'speak', 'teach', 'wear', 'throw', 'catch', 'bring',
  'build', 'hear', 'leave', 'begin', 'choose', 'hide', 'sell', 'send',
  'understand', 'grow', 'blow', 'bite', 'hit', 'keep', 'pay', 'wake',
  'spend', 'lend', 'light', 'shine', 'dig', 'feed', 'fight', 'freeze',
  'hang', 'hurt', 'learn', 'dream', 'burn', 'be',
];
const CLASS_VERBS = KIDS_ORDER.slice(0, 12);
const PACK_SIZE = 8;
const PACK_EMOJI = ['🍕', '🏊', '🔍', '💥', '🤝', '🧱', '🌱', '💸', '🔥', '⭐'];

const GROUPS_ADULT = [
  { id: 'class', label: 'Los de clase', desc: 'go, have, eat, see, buy…' },
  { id: 'AAA', label: 'Iguales: cut-cut-cut', desc: 'Las 3 formas iguales' },
  { id: 'ABB', label: 'Dos iguales: buy-bought-bought', desc: 'Pasado = participio' },
  { id: 'ABA', label: 'come-came-come', desc: 'Participio = infinitivo' },
  { id: 'ABC', label: 'Todos distintos: go-went-gone', desc: 'Los más difíciles' },
  { id: 'all', label: 'Todos', desc: 'La lista completa' },
  { id: 'hard', label: 'Mis difíciles', desc: 'Los que más te cuestan' },
];

let allVerbs = null;
let selectedGroup = null;

async function loadVerbs() {
  if (!allVerbs) {
    const { verbs } = await api('/api/verbs');
    allVerbs = verbs;
  }
  return allVerbs;
}

// Verbos disponibles según el nivel del jugador.
function levelPool(verbs) {
  if (!isKids()) return verbs;
  const byBase = new Map(verbs.map((v) => [v.base, v]));
  return KIDS_ORDER.map((b) => byBase.get(b)).filter(Boolean);
}

function kidsPacks(verbs) {
  const pool = levelPool(verbs);
  const packs = [];
  for (let i = 0; i < pool.length; i += PACK_SIZE) {
    const n = packs.length;
    packs.push({ id: `pack${n + 1}`, label: `Pack ${n + 1} ${PACK_EMOJI[n % PACK_EMOJI.length]}`, verbs: pool.slice(i, i + PACK_SIZE) });
  }
  return packs;
}

function groupVerbs(verbs, groupId) {
  if (isKids()) {
    const pack = kidsPacks(verbs).find((p) => p.id === groupId);
    return pack ? pack.verbs : levelPool(verbs).slice(0, PACK_SIZE);
  }
  const byBase = new Map(verbs.map((v) => [v.base, v]));
  switch (groupId) {
    case 'class': return CLASS_VERBS.map((b) => byBase.get(b));
    case 'AAA': case 'ABB': case 'ABA': case 'ABC': return verbs.filter((v) => v.pattern === groupId);
    case 'hard': return hardVerbs(verbs);
    default: return verbs;
  }
}

// Los que tienen más errores y menor caja.
function hardVerbs(verbs) {
  const p = store.current;
  return levelPool(verbs)
    .filter((v) => p.verbs[v.base]?.bad > 0 && (p.verbs[v.base]?.box ?? 0) < 4)
    .sort((a, b) => (p.verbs[a.base].box - p.verbs[b.base].box) || (p.verbs[b.base].bad - p.verbs[a.base].bad));
}

// Repaso inteligente: primero los que fallaste, después los nuevos, después los menos practicados.
function smartPick(verbs, n = 10) {
  const pool = levelPool(verbs);
  const box = (v) => store.verbBox(v.base);
  const failed = shuffle(pool.filter((v) => store.current.verbs[v.base]?.bad && box(v) < 4));
  const fresh = pool.filter((v) => !store.current.verbs[v.base]).slice(0, 6);
  const rest = shuffle(pool.filter((v) => !failed.includes(v) && !fresh.includes(v))).sort((a, b) => box(a) - box(b));
  return [...failed, ...fresh, ...rest].slice(0, n);
}

const mastered = (list) => list.filter((v) => store.verbBox(v.base) >= 4).length;
const firstForm = (list) => list[0]; // primer elemento

// ---------- Construcción de preguntas ----------

function askParticiple() {
  return !isKids() && store.current.includeParticiple;
}

function formLabel(form) {
  return form === 'past' ? 'Past simple' : 'Participio';
}

// Opciones incorrectas creíbles: "goed", la otra forma, la 3ra persona, otro verbo.
function distractors(verb, form, verbs) {
  const right = verb[form];
  const other = form === 'past' ? verb.participle : verb.past;
  const candidates = [
    regularPast(verb.base),
    ...other,
    verb.base,
    thirdPerson(verb.base),
    verb.base + 'ed',
    shuffle(verbs.filter((v) => v.base !== verb.base))[0]?.[form][0],
  ];
  const out = [];
  for (const c of candidates) {
    if (c && !right.includes(c) && !out.includes(c)) out.push(c);
  }
  return shuffle(out).slice(0, 3);
}

function verbQuestion(verb, kind, verbs) {
  const form = askParticiple() && Math.random() < 0.5 ? 'participle' : 'past';
  const right = verb[form];
  const kids = isKids();
  const prompt = kids
    ? `¿Cuál es el pasado de <b class="verb">${esc(verb.base)}</b>?`
    : `${formLabel(form)} de <b class="verb">${esc(verb.base)}</b>`;
  const q = {
    kind,
    prompt,
    sub: `${verb.emoji ? verb.emoji + ' ' : ''}${esc(verb.es)}`,
    answers: right,
    show: right.join(' / '),
    speakPrompt: verb.base,
    speak: `${verb.base}, ${verb.past[0]}, ${verb.participle[0]}`,
    explain: kids
      ? `${esc(verb.base)} → <b>${esc(verb.past.join(' / '))}</b>`
      : `${esc(verb.base)} → ${esc(verb.past.join(' / '))} → ${esc(verb.participle.join(' / '))}`,
    review: `${esc(verb.base)} (${form === 'past' ? 'pasado' : 'participio'})`,
    onResult: (ok) => store.recordVerb(verb.base, ok),
  };
  if (kind === 'choice') q.options = [right[0], ...distractors(verb, form, verbs)];
  return q;
}

function sentenceQuestion(s, verbs) {
  const verb = verbs.find((v) => v.base === s.verb);
  const kind = isKids() ? 'choice' : 'input';
  const right = s.answer;
  const wrong = verb
    ? [regularPast(s.verb), verb.participle[0], s.verb, thirdPerson(s.verb)]
    : [s.verb, thirdPerson(s.verb), s.verb + 'ing'];
  const options = [right[0], ...[...new Set(wrong)].filter((w) => !right.includes(w)).slice(0, 3)];
  const full = s.text.replace('___', right[0]);
  return {
    kind,
    prompt: esc(s.text).replace('___', '<span class="blank">_____</span>') + ` <span class="hint">(${esc(s.verb)})</span>`,
    sub: isKids() ? esc(s.es) : '',
    options,
    answers: right,
    speak: full,
    explain: `${esc(full)}<br><span class="muted">${esc(s.es)}</span>`,
    review: esc(s.text),
    onResult: verb ? (ok) => store.recordVerb(verb.base, ok) : undefined,
  };
}

// ---------- Pantallas ----------

export async function verbsHub() {
  const verbs = await loadVerbs();
  const kids = isKids();
  const groups = kids
    ? kidsPacks(verbs).map((p) => ({ id: p.id, label: p.label, desc: p.verbs.map((v) => v.base).slice(0, 4).join(', ') + '…', verbs: p.verbs }))
    : GROUPS_ADULT.map((g) => ({ ...g, verbs: groupVerbs(verbs, g.id) }));
  if (!selectedGroup || !groups.find((g) => g.id === selectedGroup)) selectedGroup = groups[0].id;
  const sel = groups.find((g) => g.id === selectedGroup);

  render(`
    <section>
      <a href="#/home" class="link-back">← Inicio</a>
      <h1 class="page-title">${kids ? '🦸 Verbos irregulares' : 'Verbos irregulares'}</h1>
      <p class="lead">${kids
        ? 'Elegí un pack y jugá. Cuando aciertes un verbo varias veces seguidas, ¡queda dominado ✅!'
        : 'Elegí un grupo y una forma de practicar. Los verbos que aciertes varias veces seguidas quedan dominados.'}</p>

      <h2 class="section-title">1. ${kids ? 'Elegí un pack' : 'Elegí un grupo'}</h2>
      <div class="groups">
        ${groups.map((g) => `
          <button class="group ${g.id === selectedGroup ? 'active' : ''}" data-id="${g.id}" ${g.verbs.length ? '' : 'disabled'}>
            <b>${esc(g.label)}</b>
            <span>${esc(g.desc)}</span>
            <small>${g.verbs.length ? `${mastered(g.verbs)} / ${g.verbs.length} dominados` : 'Todavía no hay'}</small>
          </button>`).join('')}
      </div>

      ${!kids ? `
        <label class="toggle">
          <input type="checkbox" id="participle" ${store.current.includeParticiple ? 'checked' : ''}>
          <span>Practicar también el participio (go → went → <b>gone</b>)</span>
        </label>` : ''}

      <h2 class="section-title">2. ${kids ? '¿A qué jugamos?' : 'Elegí cómo practicar'}</h2>
      <div class="tiles">
        <button class="tile" data-mode="cards"><span class="tile-emoji">🃏</span><b>Tarjetas</b><span>Mirá, escuchá y aprendé</span></button>
        <button class="tile" data-mode="choice"><span class="tile-emoji">👆</span><b>Elegí la correcta</b><span>Entre 4 opciones</span></button>
        <button class="tile" data-mode="input"><span class="tile-emoji">⌨️</span><b>Escribilo</b><span>Sin opciones, ¡vos solo!</span></button>
        <button class="tile" data-mode="sentences"><span class="tile-emoji">📝</span><b>En oraciones</b><span>Yesterday I ___ (go)…</span></button>
        <button class="tile" data-mode="timed"><span class="tile-emoji">⏱️</span><b>Desafío 60 segundos</b><span>Récord: ${store.current.best60 || 0}</span></button>
        <button class="tile" data-mode="smart"><span class="tile-emoji">🧠</span><b>Repaso inteligente</b><span>Te pregunta lo que más te cuesta</span></button>
      </div>

      <p class="center"><a class="btn" href="#/verbs/list">📋 Ver la lista de verbos</a></p>
      <p class="muted center">Grupo elegido: <b>${esc(sel.label)}</b> · ${sel.verbs.length} verbos</p>
    </section>`);

  $$('.group').forEach((b) => { b.onclick = () => { selectedGroup = b.dataset.id; verbsHub(); }; });
  $('#participle')?.addEventListener('change', (e) => store.updateProfile({ includeParticiple: e.target.checked }));
  $$('.tile[data-mode]').forEach((b) => { b.onclick = () => startMode(b.dataset.mode, sel.verbs, verbs, sel.label); });
}

function startMode(mode, groupList, verbs, label) {
  const N = isKids() ? 8 : 10;
  const pickN = () => shuffle(groupList).slice(0, Math.min(N, groupList.length));
  const back = '#/verbs';

  if (mode === 'cards') return flashcards(shuffle(groupList), label);

  if (mode === 'choice' || mode === 'input') {
    const build = () => pickN().map((v) => verbQuestion(v, mode, verbs));
    const cfg = { title: `${mode === 'choice' ? 'Elegí' : 'Escribí'} · ${label}`, back, questions: build() };
    cfg.restart = () => runQuiz({ ...cfg, questions: build() });
    return runQuiz(cfg);
  }

  if (mode === 'sentences') {
    const build = async () => {
      const sentences = await api('/api/sentences');
      const bases = new Set(groupList.map((v) => v.base));
      let list = sentences.filter((s) => bases.has(s.verb));
      if (list.length < 5) list = sentences.filter((s) => !isKids() || levelPool(verbs).some((v) => v.base === s.verb) || !verbs.some((v) => v.base === s.verb));
      return shuffle(list).slice(0, N).map((s) => sentenceQuestion(s, verbs));
    };
    const go = async () => {
      const cfg = { title: 'En oraciones', back, questions: await build() };
      cfg.restart = go;
      runQuiz(cfg);
    };
    return go();
  }

  if (mode === 'timed') {
    const pool = groupList.length >= 4 ? groupList : levelPool(verbs);
    const go = () => runQuiz({ title: 'Desafío 60 segundos', back, timed: 60, next: () => verbQuestion(firstForm(shuffle(pool)), 'choice', verbs), restart: go });
    return go();
  }

  if (mode === 'smart') {
    const go = () => runQuiz({
      title: 'Repaso inteligente',
      back,
      questions: smartPick(verbs, N).map((v, i) => verbQuestion(v, isKids() || i % 2 ? 'choice' : 'input', verbs)),
      restart: go,
    });
    return go();
  }
}

// Tarjetas: frente = infinitivo, dorso = pasado (y participio para grandes).
function flashcards(list, label) {
  let i = 0;
  let known = 0;
  const kids = isKids();

  const show = () => {
    if (i >= list.length) {
      if (known === list.length) confetti();
      sfx.win();
      modal(kids ? '¡Terminaste las tarjetas! 🎉' : 'Fin de las tarjetas',
        `<p>Sabías <b>${known}</b> de <b>${list.length}</b>.</p><p>Ahora probá “Elegí la correcta” para ganar estrellas.</p>`,
        [{ label: 'Volver', primary: true, onClick: () => { location.hash = '#/verbs'; } }]);
      return;
    }
    const v = list[i];
    render(`
      <section class="quiz">
        <div class="quiz-head">
          <a href="#/verbs" class="link-back">← Salir</a>
          <h1 class="quiz-title">Tarjetas · ${esc(label)}</h1>
          <div class="counter">${i + 1} / ${list.length}</div>
        </div>
        <div class="bar"><span style="width:${(i / list.length) * 100}%"></span></div>
        <button class="flashcard" id="card" aria-label="Dar vuelta la tarjeta">
          <div class="face front">
            ${v.emoji ? `<div class="q-emoji">${v.emoji}</div>` : ''}
            <div class="fc-verb">${esc(v.base)}</div>
            <div class="fc-es">${esc(v.es)}</div>
            <div class="fc-tap">${kids ? '👆 Tocá para ver el pasado' : 'Tocá (o Espacio) para dar vuelta'}</div>
          </div>
          <div class="face back">
            <div class="fc-forms">
              <div><small>Infinitivo</small><b>${esc(v.base)}</b></div>
              <div><small>Pasado</small><b>${esc(v.past.join(' / '))}</b></div>
              ${kids ? '' : `<div><small>Participio</small><b>${esc(v.participle.join(' / '))}</b></div>`}
            </div>
            <div class="fc-es">${esc(v.es)}</div>
          </div>
        </button>
        <div class="row center">
          ${canSpeak() ? '<button class="btn" id="say">🔊 Escuchar</button>' : ''}
        </div>
        <div class="row center" id="judge" hidden>
          <button class="btn btn-bad" id="no">😕 Todavía no</button>
          <button class="btn btn-good" id="yes">😀 ¡Lo sabía!</button>
        </div>
      </section>`);
    const card = $('#card');
    const flip = () => {
      card.classList.toggle('flipped');
      $('#judge').hidden = false;
      if (card.classList.contains('flipped')) speak(kids ? `${v.base}, ${v.past[0]}` : `${v.base}, ${v.past[0]}, ${v.participle[0]}`);
    };
    card.onclick = flip;
    $('#say')?.addEventListener('click', () => speak(card.classList.contains('flipped') ? `${v.base}, ${v.past[0]}${kids ? '' : ', ' + v.participle[0]}` : v.base));
    $('#yes').onclick = () => { store.recordVerb(v.base, true); known++; i++; sfx.ok(); show(); };
    $('#no').onclick = () => { store.recordVerb(v.base, false); i++; show(); };
    document.onkeydown = (e) => {
      if (e.code === 'Space' && document.activeElement === card) return; // el botón ya lo maneja
      if (e.code === 'Space') { e.preventDefault(); flip(); }
    };
    card.focus();
  };
  show();
}

// Lista completa con buscador.
export async function verbsList() {
  const verbs = await loadVerbs();
  const kids = isKids();
  const pool = levelPool(verbs);
  render(`
    <section>
      <a href="#/verbs" class="link-back">← Verbos</a>
      <h1 class="page-title">Lista de verbos irregulares</h1>
      <div class="filters">
        <input id="search" class="search" type="search" placeholder="Buscar en inglés o español…" aria-label="Buscar verbo">
        ${kids ? '' : `
        <select id="pattern" aria-label="Filtrar por tipo">
          <option value="">Todos (${pool.length})</option>
          <option value="AAA">Iguales: cut-cut-cut</option>
          <option value="ABB">Dos iguales: buy-bought-bought</option>
          <option value="ABA">come-came-come</option>
          <option value="ABC">Todos distintos: go-went-gone</option>
        </select>`}
      </div>
      <div class="table-wrap">
        <table class="verbs-table">
          <thead><tr><th>Infinitivo</th><th>Pasado</th>${kids ? '' : '<th>Participio</th>'}<th>Español</th><th></th></tr></thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
      <p class="muted">✅ = verbo dominado · 🟡 = lo estás practicando</p>
    </section>`);

  const draw = () => {
    const term = $('#search').value.trim().toLowerCase();
    const pat = $('#pattern')?.value || '';
    const rows = pool.filter((v) => (!pat || v.pattern === pat)
      && (!term || v.base.includes(term) || v.es.includes(term) || v.past.some((p) => p.includes(term)) || v.participle.some((p) => p.includes(term))));
    $('#rows').innerHTML = rows.map((v) => {
      const box = store.verbBox(v.base);
      const mark = box >= 4 ? '✅' : box > 0 ? '🟡' : '';
      return `<tr>
        <td><b>${v.emoji ? v.emoji + ' ' : ''}${esc(v.base)}</b> ${mark}</td>
        <td>${esc(v.past.join(' / '))}</td>
        ${kids ? '' : `<td>${esc(v.participle.join(' / '))}</td>`}
        <td class="muted">${esc(v.es)}</td>
        <td>${canSpeak() ? `<button class="icon-btn" data-say="${esc(`${v.base}, ${v.past[0]}${kids ? '' : ', ' + v.participle[0]}`)}" aria-label="Escuchar ${esc(v.base)}">🔊</button>` : ''}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="5" class="muted">No se encontró ningún verbo.</td></tr>`;
    $$('[data-say]').forEach((b) => { b.onclick = () => speak(b.dataset.say); });
  };
  $('#search').oninput = draw;
  $('#pattern')?.addEventListener('change', draw);
  draw();
}

// ---------- Verbos regulares ----------

const SOUND_LABEL = { t: '/t/', d: '/d/', id: '/ɪd/' };

export async function regularHub() {
  const kids = isKids();
  render(`
    <section>
      <a href="#/home" class="link-back">← Inicio</a>
      <h1 class="page-title">Verbos regulares (-ed)</h1>
      <div class="card tips">
        <h2>Recordá</h2>
        <ul>
          <li>La mayoría: <b>+ed</b> → work → worked</li>
          <li>Terminan en <b>e</b>: solo <b>+d</b> → live → lived</li>
          <li>Consonante + <b>y</b> → <b>ied</b> → study → studied</li>
          <li>Vocal + <b>y</b> → <b>+ed</b> → play → played</li>
          <li>Consonante-vocal-consonante: se duplica → stop → stopped</li>
        </ul>
        ${kids ? '' : `
        <h2>¿Cómo suena la -ed?</h2>
        <ul>
          <li><b>/ɪd/</b> si el verbo termina en sonido t o d → wanted, needed</li>
          <li><b>/t/</b> después de p, k, s, sh, ch, f → helped, watched</li>
          <li><b>/d/</b> en el resto → played, cleaned</li>
        </ul>`}
      </div>
      <div class="tiles">
        <button class="tile" id="spell"><span class="tile-emoji">✍️</span><b>Agregá la -ed</b><span>Escribí el pasado bien escrito</span></button>
        <button class="tile" id="sound"><span class="tile-emoji">👂</span><b>¿Cómo suena?</b><span>/t/, /d/ o /ɪd/</span></button>
      </div>
    </section>`);

  const { verbs } = await api('/api/verbs?type=regular');

  const spell = () => runQuiz({
    title: 'Agregá la -ed',
    back: '#/regular',
    restart: spell,
    questions: shuffle(verbs).slice(0, 10).map((v) => ({
      kind: kids ? 'choice' : 'input',
      prompt: `Pasado de <b class="verb">${esc(v.base)}</b>`,
      sub: esc(v.es),
      options: [v.past, ...new Set([v.base + 'ed', v.base + 'd', regularPast(v.base), v.base.replace(/y$/, 'ied'), v.base + v.base.slice(-1) + 'ed'])].filter((o, i, a) => a.indexOf(o) === i && (i === 0 || o !== v.past)).slice(0, 4),
      answers: [v.past],
      speakPrompt: v.base,
      speak: `${v.base}, ${v.past}`,
      explain: `${esc(v.base)} → <b>${esc(v.past)}</b>`,
    })),
  });

  const sound = () => runQuiz({
    title: '¿Cómo suena?',
    back: '#/regular',
    restart: sound,
    questions: shuffle(verbs).slice(0, 10).map((v) => ({
      kind: 'choice',
      keepOrder: true,
      prompt: `¿Cómo suena el final de <b class="verb">${esc(v.past)}</b>?`,
      sub: 'Tocá 🔊 para escucharlo',
      options: ['/t/', '/d/', '/ɪd/'],
      answers: [SOUND_LABEL[v.sound]],
      speakPrompt: v.past,
      speak: v.past,
      autoSpeak: true,
      explain: v.sound === 'id' ? 'Termina en t o d → se agrega una sílaba: /ɪd/'
        : v.sound === 't' ? 'Termina en sonido “sordo” (p, k, s, sh, ch, f) → /t/' : 'Termina en sonido “sonoro” → /d/',
    })),
  });

  $('#spell').onclick = spell;
  $('#sound').onclick = sound;
}
