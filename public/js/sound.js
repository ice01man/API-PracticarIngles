// sound.js
// Pronunciación con la voz del navegador y sonidos cortos de acierto/error.

import { store } from './store.js';

let voice = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  voice = voices.find((v) => v.lang === 'en-US' && /Google|Samantha|Microsoft/i.test(v.name))
    || voices.find((v) => v.lang === 'en-US')
    || voices.find((v) => v.lang?.startsWith('en'))
    || null;
}

if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export const canSpeak = () => 'speechSynthesis' in window;

// Lee un texto en inglés. Más lento para los chicos.
export function speak(text) {
  if (!canSpeak() || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  if (voice) u.voice = voice;
  u.rate = store.current?.level === 'kids' ? 0.8 : 0.9;
  speechSynthesis.speak(u);
}

let ctx = null;
function beep(freqs, type = 'sine') {
  if (!store.soundOn) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.11;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.2);
    });
  } catch { /* sin audio */ }
}

export const sfx = {
  ok: () => beep([660, 880]),
  bad: () => beep([220, 180], 'triangle'),
  win: () => beep([523, 659, 784, 1047]),
};
