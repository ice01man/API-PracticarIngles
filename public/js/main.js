// main.js
// Punto de entrada: jugadores, pantalla de inicio y navegación (#/ruta).

import { $, $$, esc, render, renderTopbar, modal, api, isKids } from './ui.js';
import { store } from './store.js';
import { verbsHub, verbsList, regularHub } from './verbs.js';
import { lessonsList, lessonView } from './lessons.js';
import { picturesList, pictureGame } from './pictures.js';

const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🐙', '🦄', '🐯', '🐧', '🚀', '⚽', '🎸', '😎'];

// ---------- Jugadores ----------

function profilesView() {
  const list = store.profiles;
  render(`
    <section class="narrow">
      <h1 class="page-title center">¿Quién va a practicar?</h1>
      <p class="lead center">Cada jugador guarda sus estrellas y su progreso.</p>
      ${list.length ? `
        <div class="profiles">
          ${list.map((p) => `
            <div class="profile">
              <button class="profile-main" data-id="${p.id}">
                <span class="profile-avatar">${esc(p.avatar)}</span>
                <b>${esc(p.name)}</b>
                <small>${p.level === 'kids' ? 'Modo chicos' : 'Modo grandes'} · ⭐ ${p.stars}</small>
              </button>
              <button class="icon-btn small" data-del="${p.id}" aria-label="Borrar a ${esc(p.name)}">🗑️</button>
            </div>`).join('')}
        </div>` : ''}
      <form class="card new-profile" id="new-profile">
        <h2>${list.length ? 'Agregar jugador' : 'Crear jugador'}</h2>
        <label>Nombre
          <input id="name" maxlength="20" required placeholder="Ej: Sofi, Papá…" autocomplete="off">
        </label>
        <fieldset>
          <legend>Elegí un avatar</legend>
          <div class="avatars">
            ${AVATARS.map((a, i) => `<label class="avatar-opt"><input type="radio" name="avatar" value="${a}" ${i === 0 ? 'checked' : ''}><span>${a}</span></label>`).join('')}
          </div>
        </fieldset>
        <fieldset>
          <legend>¿Cómo querés practicar?</legend>
          <div class="levels">
            <label class="level-opt"><input type="radio" name="level" value="kids" checked>
              <span><b>🧒 Modo chicos</b><small>Letra grande, emojis, verbos más usados de a poquito, solo pasado.</small></span></label>
            <label class="level-opt"><input type="radio" name="level" value="adult">
              <span><b>🧑 Modo grandes</b><small>Lista completa, participio, escritura y desafíos.</small></span></label>
          </div>
        </fieldset>
        <button class="btn btn-primary btn-big" type="submit">¡Empezar!</button>
      </form>
    </section>`);

  $$('[data-id]').forEach((b) => { b.onclick = () => { store.selectProfile(b.dataset.id); location.hash = '#/home'; }; });
  $$('[data-del]').forEach((b) => {
    b.onclick = () => {
      const p = store.profiles.find((x) => x.id === b.dataset.del);
      modal('¿Borrar jugador?', `<p>Se va a borrar el progreso de <b>${esc(p.name)}</b>.</p>`, [
        { label: 'Cancelar' },
        { label: 'Borrar', primary: true, onClick: () => { store.deleteProfile(p.id); profilesView(); } },
      ]);
    };
  });
  $('#new-profile').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.createProfile({ name: $('#name').value, avatar: fd.get('avatar'), level: fd.get('level') });
    location.hash = '#/home';
  };
}

// ---------- Inicio ----------

async function homeView() {
  const p = store.current;
  const kids = isKids();
  let total = 0;
  try {
    const { total: t } = await api(`/api/verbs${kids ? '?level=kids' : ''}`);
    total = t;
  } catch { /* si falla la API, mostramos igual el inicio */ }
  const masteredCount = Object.values(p.verbs).filter((v) => v.box >= 4).length;
  const pct = total ? Math.min(100, Math.round((masteredCount / total) * 100)) : 0;

  render(`
    <section>
      <div class="hello card">
        <div class="hello-avatar">${esc(p.avatar)}</div>
        <div>
          <h1>${kids ? `¡Hola, ${esc(p.name)}! 👋` : `Hola, ${esc(p.name)}`}</h1>
          <p>${kids ? '¿Listo para ganar estrellas hoy?' : 'Unos minutos por día hacen la diferencia.'}</p>
          <div class="progress-line">
            <span>Verbos irregulares dominados: <b>${masteredCount}</b> de ${total}</span>
            <div class="bar"><span style="width:${pct}%"></span></div>
          </div>
        </div>
      </div>

      <div class="tiles big">
        <a class="tile tile-verbs" href="#/verbs"><span class="tile-emoji">🦸</span><b>Verbos irregulares</b><span>go → went, eat → ate…</span></a>
        <a class="tile tile-regular" href="#/regular"><span class="tile-emoji">✍️</span><b>Verbos regulares</b><span>play → played · ¿cómo suena?</span></a>
        <a class="tile tile-lessons" href="#/lessons"><span class="tile-emoji">📚</span><b>Lecciones de clase</b><span>was/were, comparatives, can…</span></a>
        <a class="tile tile-pictures" href="#/pictures"><span class="tile-emoji">🖼️</span><b>Juegos con imágenes</b><span>Mirá y respondé</span></a>
      </div>

      <p class="center muted">${kids ? '🦉 Tip: tocá 🔊 para escuchar cómo se dice.' : 'Tip: en las preguntas de opciones podés usar las teclas 1 a 4.'}</p>
      <p class="center"><button class="btn btn-small" id="switch-level">Cambiar a ${kids ? 'modo grandes' : 'modo chicos'}</button></p>
    </section>`);

  $('#switch-level').onclick = () => { store.updateProfile({ level: kids ? 'adult' : 'kids' }); homeView(); };
}

// ---------- Navegación ----------

const routes = [
  [/^#\/profiles$/, profilesView, false],
  [/^#\/home$/, homeView],
  [/^#\/verbs$/, verbsHub],
  [/^#\/verbs\/list$/, verbsList],
  [/^#\/regular$/, regularHub],
  [/^#\/lessons$/, lessonsList],
  [/^#\/lessons\/([\w-]+)$/, lessonView],
  [/^#\/pictures$/, picturesList],
  [/^#\/pictures\/([\w-]+)$/, pictureGame],
];

async function router() {
  document.onkeydown = null;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  const hash = location.hash || '#/home';
  const needsProfile = !store.current;
  if (needsProfile && hash !== '#/profiles') { location.hash = '#/profiles'; return; }
  const route = routes.find(([re]) => re.test(hash));
  if (!route) { location.hash = '#/home'; return; }
  const [re, view] = route;
  try {
    await view(...hash.match(re).slice(1));
  } catch (err) {
    console.error(err);
    render(`<section class="narrow card center">
      <h1>Ups, algo falló 😕</h1>
      <p>No se pudo cargar esta parte. Revisá que el servidor esté andando y probá de nuevo.</p>
      <a class="btn btn-primary" href="#/home">Volver al inicio</a></section>`);
  }
}

window.addEventListener('hashchange', router);
renderTopbar();
router();
