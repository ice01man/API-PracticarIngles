# English Practice 🦉

App web para practicar inglés en familia: verbos irregulares, verbos regulares y la gramática vista en clase.
Sirve tanto para un chico de 9 años como para un adulto: cada jugador elige su modo y guarda su propio progreso.

## Cómo levantarla

```bash
npm install
npm start        # http://localhost:3000
npm run dev      # se reinicia solo al guardar (node --watch)
npm test         # pruebas de la API y de la corrección de respuestas
```

Necesita Node 26 (versión LTS actual). El puerto se cambia con la variable `PORT`.

## Qué tiene

Jugadores
- Cada persona crea su jugador con nombre, avatar y modo.
- El progreso (estrellas, racha de días, verbos dominados, mejores notas) se guarda en el navegador.

Modo chicos
- Letra más grande, colores y emojis.
- 74 verbos irregulares, los más usados, ordenados en packs de 8. El Pack 1 son los verbos de la clase del 21/10.
- Solo pasado simple (lo que se ve en Unit 7).
- Al escribir, muestra las letras que van bien y da pistas. Siempre hay un segundo intento.

Modo grandes
- Los 154 verbos irregulares del PDF de la clase.
- Grupos por patrón para memorizar mejor: cut-cut-cut, buy-bought-bought, come-came-come, go-went-gone.
- Opción de practicar también el participio.
- Atajos de teclado 1 a 4 en las preguntas de opciones.

Formas de practicar los verbos
- Tarjetas: se dan vuelta, se escuchan y uno marca si lo sabía.
- Elegí la correcta: 4 opciones con los errores típicos (goed, gone, goes).
- Escribilo: sin opciones.
- En oraciones: "Yesterday I ___ (go) to the cinema", con la traducción.
- Desafío 60 segundos, con récord personal.
- Repaso inteligente: pregunta primero lo que más te cuesta (sistema de cajas tipo Leitner).
- Lista completa con buscador en inglés o español y pronunciación.

Verbos regulares
- Reglas de escritura de -ed (lived, studied, played, stopped).
- Juego de pronunciación de la -ed: /t/, /d/ o /ɪd/.

Lecciones de clase
- Unit 1 Was / Were, Units 2 y 5 Countable / Uncountable, Unit 3 Present simple, Unit 4 Comparatives,
  Unit 7 Past simple, Unit 8 Tag questions y Can, Unit 9 Have to y May, y un repaso general.
- Cada una tiene un resumen corto y ejercicios de elegir, completar y ordenar palabras.

Juegos con imágenes
- Los 7 ejercicios originales del proyecto, corregidos (textos, respuestas y el texto de "My cousin Nick").

Pronunciación
- Usa la voz del navegador (Web Speech API), sin servicios externos.

## App instalable (PWA)

- Se puede instalar en el celular o la compu como una app, con su ícono (el búho 🦉 con birrete).
- Android y Chrome/Edge: aparece el botón "📲 Instalar" arriba.
- iPhone/iPad: en Safari, Compartir → Agregar a inicio (la app muestra el aviso).
- Funciona sin internet: guarda la app, las imágenes, los verbos y las lecciones la primera vez que se abre.
- Archivos: `public/manifest.webmanifest`, `public/sw.js`, `public/js/pwa.js` y `public/icons/`.
- Importante: cuando cambies algo de la app, subí `VERSION` en `public/sw.js` (v1 → v2) para que los celulares tomen la versión nueva.

## API

| Ruta | Qué devuelve |
|---|---|
| `GET /api/verbs?type=irregular\|regular&level=kids&pattern=ABC` | Lista de verbos |
| `GET /api/verbs/:base` | Un verbo (ej. `/api/verbs/go`) |
| `GET /api/sentences` | Oraciones en pasado para practicar |
| `GET /api/lessons` | Lecciones (sin ejercicios) |
| `GET /api/lessons/:id` | Una lección con sus ejercicios |
| `GET /api/picture-games` | Juegos con imágenes |
| `GET /api/health` | Estado del servidor |

## Estructura

```
app.js              Express: la API
api/index.js        Entrada para Vercel (usa app.js)
vercel.json         Configuración de Vercel
start.js            Levanta el servidor en la compu (npm start)
data/
  verbs.js          Verbos del PDF de clase (irregulares y regulares)
  lessons.js        Lecciones armadas con las clases
  sentences.js      Oraciones para practicar verbos en contexto
  picture-games.js  Juegos con imágenes
public/
  index.html
  manifest.webmanifest  Datos de la app instalable (nombre, colores, íconos)
  sw.js             Service worker: uso sin conexión
  icons/            Ícono en SVG y PNG (192, 512, maskable, Apple)
  css/style.css
  js/main.js        Jugadores, inicio y navegación
  js/quiz.js        Motor de preguntas que usan todos los juegos
  js/verbs.js       Juegos de verbos y lista
  js/lessons.js     Lecciones
  js/pictures.js    Juegos con imágenes
  js/store.js       Progreso en el navegador
  js/sound.js       Voz y sonidos
  js/answers.js     Corrección de respuestas
  js/pwa.js         Instalación y service worker
tests/api.test.js
```

## Cómo agregar contenido

- Una lección nueva: agregar un objeto en `data/lessons.js` (tipos `choice`, `fill` u `order`).
- Más oraciones: agregar en `data/sentences.js`.
- Los tests revisan que cada respuesta de opción múltiple esté entre las opciones y que las palabras para ordenar armen la oración.

## Publicar en Vercel

- `api/index.js` es la función que atiende todo lo que empieza con `/api/`. Usa la misma app de `app.js`.
- `vercel.json` manda cada pedido `/api/...` a esa función.
- Los archivos de `public/` (la página, el CSS, el JS y las imágenes) los sirve Vercel directamente.
- En Vercel: Settings → Build and Deployment → Framework Preset en "Other", sin Build Command y con Output Directory vacío o `public`.
- Para probar: `/api/health` tiene que mostrar `{"ok":true}`.
