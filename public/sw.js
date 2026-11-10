// sw.js — Service worker: permite instalar la app y usarla sin conexión.
// Cuando cambies archivos de la app, subí el número de VERSION para que se actualice.

const VERSION = 'v1';
const CACHE = `english-practice-${VERSION}`;

// Archivos de la app
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/style.css',
  '/js/main.js',
  '/js/ui.js',
  '/js/store.js',
  '/js/sound.js',
  '/js/answers.js',
  '/js/quiz.js',
  '/js/verbs.js',
  '/js/lessons.js',
  '/js/pictures.js',
  '/js/pwa.js',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
];

// Imágenes de los juegos
const IMAGES = [
  '/img/E7-myCousinNick.png',
  '/img/e1aeroplane.png',
  '/img/e1balloon.png',
  '/img/e1book.png',
  '/img/e1chears.png',
  '/img/e1dress.png',
  '/img/e1duck.png',
  '/img/e1erase.png',
  '/img/e1eye.png',
  '/img/e3bike.png',
  '/img/e3boat.png',
  '/img/e3car.png',
  '/img/e3helicopter.png',
  '/img/e3livingroom.png',
  '/img/e3plane.png',
  '/img/e3train.png',
  '/img/e4apples.png',
  '/img/e4bikes.png',
  '/img/e4board.png',
  '/img/e4eyes.png',
  '/img/e4tennisracket.png',
  '/img/e4tshorts.png',
  '/img/e4watch.png',
  '/img/e5-bean.png',
  '/img/e5-beanR.png',
  '/img/e5-bread.png',
  '/img/e5-breadR.png',
  '/img/e5-frise.png',
  '/img/e5-friseR.png',
  '/img/e5-grapes.png',
  '/img/e5-grapesR.png',
  '/img/e5-sausage.png',
  '/img/e5-sausageR.png',
  '/img/e5-watermelon.png',
  '/img/e5-watermelonR.png',
  '/img/e5lucybethroom.png',
  '/img/e7-mycousinNick2.png',
  '/img/imagen10.png',
];

// Datos de la API (verbos, lecciones, juegos)
const API = [
  '/api/verbs',
  '/api/verbs?level=kids',
  '/api/verbs?type=regular',
  '/api/sentences',
  '/api/lessons',
  '/api/picture-games',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([...SHELL, ...API]);
    // Las imágenes y cada lección se guardan "de a una" para que un error no frene la instalación
    const lessons = await fetch('/api/lessons').then((r) => r.json()).catch(() => []);
    const extra = [...IMAGES, ...lessons.map((l) => `/api/lessons/${l.id}`)];
    await Promise.all(extra.map((url) => cache.add(url).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('english-practice-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // fuentes de Google, etc.: que las maneje el navegador

  // API: primero internet (datos frescos), si no hay conexión usa lo guardado
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(req));
    return;
  }
  // Páginas: si no hay conexión, devolver la app
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(async () => (await caches.match('/index.html')) || Response.error()));
    return;
  }
  // Resto (JS, CSS, imágenes): lo guardado al instante y se actualiza en segundo plano
  event.respondWith(staleWhileRevalidate(event, req));
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req)) || Response.json({ error: 'Sin conexión' }, { status: 503 });
  }
}

async function staleWhileRevalidate(event, req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const update = fetch(req).then((res) => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  if (cached) {
    event.waitUntil(update);
    return cached;
  }
  return (await update) || new Response('', { status: 504 });
}
