// server.js
// Para ejecutar este archivo con sintaxis de módulos, necesitas una de estas opciones:
// 1. Usa la extensión .mjs (ej. server.mjs).
// 2. Agrega "type": "module" en tu archivo package.json.
// 3. Ejecuta con el flag: node --experimental-modules server.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configurar Express para servir archivos estáticos desde la carpeta 'public'
// La estructura de carpetas debe ser:
// - project-root/
//   - server.js
//   - public/
//     - index.html
//     - css/
//       - style.css
//     - js/
//       - index.js
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de la aplicación de estudio escuchando en http://localhost:${port}`);
});
