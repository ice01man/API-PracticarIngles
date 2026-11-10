import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';
import { checkAnswer, normalize } from '../public/js/answers.js';

let server, base;
before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json() }; };

test('lista de verbos irregulares completa', async () => {
  const { body } = await get('/api/verbs');
  assert.ok(body.total >= 150);
  const go = body.verbs.find((v) => v.base === 'go');
  assert.deepEqual(go.past, ['went']);
  assert.deepEqual(go.participle, ['gone']);
});

test('nivel chicos devuelve menos verbos', async () => {
  const { body } = await get('/api/verbs?level=kids');
  assert.ok(body.total > 30 && body.total < 100);
  assert.ok(body.verbs.every((v) => v.kids && v.emoji));
});

test('verbos regulares con sonido', async () => {
  const { body } = await get('/api/verbs?type=regular');
  assert.ok(body.verbs.every((v) => ['t', 'd', 'id'].includes(v.sound)));
  assert.equal(body.verbs.find((v) => v.base === 'plan').past, 'planned');
});

test('tipo inválido da 400 y ruta inexistente 404', async () => {
  assert.equal((await get('/api/verbs?type=xx')).status, 400);
  assert.equal((await get('/api/nada')).status, 404);
  assert.equal((await get('/api/lessons/nada')).status, 404);
});

test('lecciones: cada ejercicio choice tiene su respuesta entre las opciones', async () => {
  const { body: list } = await get('/api/lessons');
  assert.ok(list.length >= 8);
  for (const l of list) {
    const { body } = await get(`/api/lessons/${l.id}`);
    for (const ex of body.exercises) {
      if (ex.type === 'choice') assert.ok(ex.options.includes(ex.answer), `${l.id}: ${ex.q}`);
      if (ex.type === 'fill') assert.ok(Array.isArray(ex.answer) && ex.answer.length);
    }
  }
});

test('ordenar: las palabras forman exactamente la respuesta', async () => {
  const { body: list } = await get('/api/lessons');
  for (const l of list) {
    const { body } = await get(`/api/lessons/${l.id}`);
    for (const ex of body.exercises.filter((e) => e.type === 'order')) {
      const fromWords = ex.answer.split(' ');
      const joined = [...ex.words].join(' ').split(' ').sort().join('|');
      assert.equal(joined, [...fromWords].sort().join('|'), ex.answer);
    }
  }
});

test('corrección de respuestas tolera mayúsculas, espacios y apóstrofos', () => {
  assert.equal(normalize('  Didn’t   GO '), "didn't go");
  assert.ok(checkAnswer('WENT', ['went']));
  assert.ok(checkAnswer('burned', ['burnt', 'burned']));
  assert.ok(!checkAnswer('goed', ['went']));
});

test('oraciones: si el verbo es irregular, la respuesta coincide con la lista', async () => {
  const { body: sentences } = await get('/api/sentences');
  const { body } = await get('/api/verbs');
  const irregular = new Map(body.verbs.map((v) => [v.base, v]));
  for (const s of sentences) {
    assert.ok(s.text.includes('___'), s.text);
    const v = irregular.get(s.verb);
    if (v) assert.ok(s.answer.every((a) => v.past.includes(a)), `${s.verb}: ${s.answer}`);
  }
});
