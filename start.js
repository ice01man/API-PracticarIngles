// start.js
// Levanta el servidor en la compu (npm start). En Vercel no se usa: Vercel toma app.js.
// Puerto configurable con la variable PORT (por defecto 3000).

import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`English Practice escuchando en http://localhost:${port}`);
});
