// store.js
// Guarda jugadores y progreso en el navegador (localStorage).
// Cada jugador tiene su propio progreso: un chico y un adulto pueden usar la misma compu.

const KEY = 'english-practice-v2';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (data && Array.isArray(data.profiles)) return data;
  } catch { /* sin storage o datos rotos: arrancamos de cero */ }
  return { profiles: [], currentId: null, sound: true };
}

let state = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* modo privado, etc. */ }
}

const today = () => new Date().toISOString().slice(0, 10);

export const store = {
  get profiles() { return state.profiles; },
  get current() { return state.profiles.find((p) => p.id === state.currentId) || null; },
  get soundOn() { return state.sound !== false; },

  toggleSound() { state.sound = !this.soundOn; save(); return state.sound; },

  createProfile({ name, avatar, level }) {
    const profile = {
      id: Date.now().toString(36),
      name: name.trim().slice(0, 20) || 'Jugador',
      avatar,
      level, // 'kids' | 'adult'
      stars: 0,
      streak: 0,
      lastDay: null,
      verbs: {}, // base -> { box, ok, bad }
      lessons: {}, // id -> mejor porcentaje
      best60: 0,
    };
    state.profiles.push(profile);
    state.currentId = profile.id;
    save();
    return profile;
  },

  selectProfile(id) { state.currentId = id; save(); },
  logout() { state.currentId = null; save(); },

  deleteProfile(id) {
    state.profiles = state.profiles.filter((p) => p.id !== id);
    if (state.currentId === id) state.currentId = null;
    save();
  },

  updateProfile(changes) {
    Object.assign(this.current, changes);
    save();
  },

  // Suma estrellas y actualiza la racha de días seguidos.
  addStars(n) {
    const p = this.current;
    if (!p) return;
    p.stars += n;
    const t = today();
    if (p.lastDay !== t) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      p.streak = p.lastDay === yesterday ? p.streak + 1 : 1;
      p.lastDay = t;
    }
    save();
  },

  // Sistema de cajas (Leitner): si acertás sube de caja, si errás vuelve a la 1.
  // Caja 4 o más = verbo dominado.
  recordVerb(base, correct) {
    const p = this.current;
    if (!p) return;
    const v = p.verbs[base] || { box: 0, ok: 0, bad: 0 };
    if (correct) { v.ok++; v.box = Math.min(5, v.box + 1); } else { v.bad++; v.box = 1; }
    p.verbs[base] = v;
    save();
  },

  verbBox(base) { return this.current?.verbs[base]?.box ?? 0; },

  recordLesson(id, percent) {
    const p = this.current;
    if (!p) return;
    p.lessons[id] = Math.max(p.lessons[id] || 0, percent);
    save();
  },

  recordBest60(score) {
    const p = this.current;
    const isRecord = score > (p.best60 || 0);
    if (isRecord) { p.best60 = score; save(); }
    return isRecord;
  },
};
