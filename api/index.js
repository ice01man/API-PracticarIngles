// api/index.js
// Función de Vercel: todo lo que llega a /api/... lo atiende la app de Express.
// (vercel.json redirige /api/* a este archivo)

import app from '../app.js';

export default app;
