// ui.js
// Ayudas de interfaz: escapar texto, dibujar pantallas, modal, confeti y llamadas a la API.

import { store } from './store.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Escapa texto para meterlo en HTML sin riesgos (por ejemplo, el nombre del jugador).
export function esc(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const cache = new Map();
export async function api(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(path).then((r) => {
      if (!r.ok) throw new Error(`Error ${r.status} en ${path}`);
      return r.json();
    }).catch((e) => { cache.delete(path); throw e; }));
  }
  return cache.get(path);
}

export const isKids = () => store.current?.level === 'kids';

// Dibuja una pantalla en el contenedor principal.
export function render(html) {
  const app = $('#app');
  app.innerHTML = html;
  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
  renderTopbar();
}

export function renderTopbar() {
  const p = store.current;
  document.body.classList.toggle('mode-kids', p?.level === 'kids');
  document.body.classList.toggle('mode-adult', p?.level === 'adult');
  $('#topbar').innerHTML = p ? `
    <a href="#/home" class="brand" aria-label="Inicio">🦉 <span>English Practice</span></a>
    <div class="topbar-right">
      <span class="pill" title="Estrellas">⭐ ${p.stars}</span>
      <span class="pill" title="Días seguidos practicando">🔥 ${p.streak}</span>
      <button class="icon-btn" id="sound-btn" aria-label="Sonido">${store.soundOn ? '🔊' : '🔇'}</button>
      <a href="#/profiles" class="avatar-btn" title="Cambiar jugador">${esc(p.avatar)}</a>
    </div>` : `<span class="brand">🦉 <span>English Practice</span></span>`;
  const sb = $('#sound-btn');
  if (sb) sb.onclick = () => { store.toggleSound(); renderTopbar(); };
}

// Ventana emergente simple. "buttons" es una lista de { label, primary, onClick }.
export function modal(title, bodyHtml, buttons = [{ label: 'Continuar', primary: true }]) {
  const wrap = $('#modal');
  wrap.innerHTML = `
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">${title}</h2>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-actions">
        ${buttons.map((b, i) => `<button class="btn ${b.primary ? 'btn-primary' : ''}" data-i="${i}">${b.label}</button>`).join('')}
      </div>
    </div>`;
  wrap.hidden = false;
  $$('button', wrap).forEach((btn) => {
    btn.onclick = () => {
      wrap.hidden = true;
      buttons[btn.dataset.i].onClick?.();
    };
  });
  $('button.btn-primary', wrap)?.focus();
}

// Confeti de festejo (sin librerías).
export function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#c77dff'];
  const layer = document.createElement('div');
  layer.className = 'confetti';
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('i');
    s.style.left = Math.random() * 100 + 'vw';
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = Math.random() * 0.6 + 's';
    s.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
    s.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(s);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 3500);
}

// Mensajes de ánimo: más juguetones para chicos, más sobrios para adultos.
const PRAISE_KIDS = ['¡Genial! 🎉', '¡Muy bien! ⭐', '¡Sos un crack! 🚀', '¡Excelente! 🌟', '¡Bien ahí! 🙌'];
const PRAISE_ADULT = ['Correcto ✓', '¡Bien!', 'Perfecto ✓', 'Exacto ✓'];
const RETRY_KIDS = ['¡Casi! Mirá bien 👀', 'Uy, no era esa 🙃', '¡No pasa nada, seguí! 💪'];
const RETRY_ADULT = ['No es correcto', 'Casi', 'Revisalo'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const praise = () => pick(isKids() ? PRAISE_KIDS : PRAISE_ADULT);
export const retryMsg = () => pick(isKids() ? RETRY_KIDS : RETRY_ADULT);
