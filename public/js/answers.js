// answers.js
// Funciones puras para corregir respuestas. Se usan en el navegador y en los tests.

// Pasa a minúsculas, unifica apóstrofos y saca espacios de más.
export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/\s+([?.!,])/g, '$1')
    .trim();
}

// true si la respuesta coincide con alguna de las válidas.
export function checkAnswer(userText, validAnswers) {
  const list = Array.isArray(validAnswers) ? validAnswers : [validAnswers];
  const user = normalize(userText);
  return list.some((a) => normalize(a) === user);
}

// Pasado "regularizado" (el error típico: goed, eated). Sirve como opción incorrecta.
export function regularPast(base) {
  if (base.endsWith('e')) return base + 'd';
  if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + 'ied';
  return base + 'ed';
}

// Tercera persona del presente (goes, watches, studies, plays).
export function thirdPerson(base) {
  if (base === 'have') return 'has';
  if (/(o|ch|sh|ss|x|z)$/.test(base)) return base + 'es';
  if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + 'ies';
  return base + 's';
}

// Mezcla un array (copia).
export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
