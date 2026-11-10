// server.js
// Levanta el servidor. Puerto configurable con la variable PORT (por defecto 3000).

import { createApp } from './app.js';

const port = process.env.PORT || 3000;

createApp().listen(port, () => {
  console.log(`English Practice escuchando en http://localhost:${port}`);
});
