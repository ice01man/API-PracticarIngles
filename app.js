// app.js
// Arma la aplicación Express (API + archivos estáticos).
// En Vercel este es el punto de entrada: Vercel usa el "export default".
// En la compu se levanta con start.js (npm start).

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { lessons } from './data/lessons.js';
import { pictureGames } from './data/picture-games.js';
import { pastSentences } from './data/sentences.js';
import { verbs } from './data/verbs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  // GET /api/verbs?type=irregular|regular&level=kids|adult&pattern=AAA|ABB|ABC|ABA
  app.get('/api/verbs', (req, res) => {
    const { type = 'irregular', level, pattern } = req.query;
    if (!['irregular', 'regular'].includes(type)) {
      return res.status(400).json({ error: 'type debe ser irregular o regular' });
    }
    let list = verbs[type];
    if (type === 'irregular' && level === 'kids') list = list.filter((v) => v.kids);
    if (type === 'irregular' && pattern) list = list.filter((v) => v.pattern === pattern);
    res.json({ total: list.length, verbs: list });
  });

  app.get('/api/verbs/:base', (req, res) => {
    const base = req.params.base.toLowerCase();
    const verb = verbs.irregular.find((v) => v.base === base) || verbs.regular.find((v) => v.base === base);
    if (!verb) return res.status(404).json({ error: 'Verbo no encontrado' });
    res.json(verb);
  });

  app.get('/api/sentences', (req, res) => res.json(pastSentences));

  app.get('/api/lessons', (req, res) => {
    res.json(lessons.map(({ exercises, tips, ...rest }) => ({ ...rest, count: exercises.length })));
  });

  app.get('/api/lessons/:id', (req, res) => {
    const lesson = lessons.find((l) => l.id === req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });
    res.json(lesson);
  });

  app.get('/api/picture-games', (req, res) => res.json(pictureGames));

  // Cualquier otra ruta /api que no exista
  app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

  return app;
}

export default createApp();
