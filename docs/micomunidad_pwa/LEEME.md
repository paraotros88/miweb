# MiComunidad · versión instalable (PWA)

© 2026 CristianFG · Todos los derechos reservados · Versión 21 Nov 2026

Dos aplicaciones **independientes** (no comparten ningún fichero). Cada carpeta lleva todo lo suyo:

```
MiComunidad/                     ← versión completa
├─ MiComunidad.html              (página principal; NO hay index.html)
├─ manifest.webmanifest          (datos de instalación)
├─ sw.js                         (service worker: funcionamiento sin conexión)
├─ css/styles.css
├─ js/config.js                  (solo: const DEMO=false;)
├─ js/app.js                     (todo el código; al final registra el service worker)
└─ icons/  icon.svg · icon-192.png · icon-512.png · icon-maskable-512.png · apple-touch-icon.png

MiComunidad_Demo/                ← versión DEMO (misma estructura)
├─ MiComunidad_Demo.html
├─ js/config.js                  (solo: const DEMO=true;)
└─ …                             (iconos con la banda «DEMO»)
```

El texto de la ley (BOE) sigue incrustado en el propio HTML, como antes. Los datos de los usuarios se guardan en el navegador (IndexedDB) con los mismos nombres de siempre (`micomunidad2026` y `micomunidad2026_demo`), así que cada versión conserva sus datos y no se mezclan.

## Cómo publicarlo (como subcarpetas dentro de tu web)

1. Copia las dos carpetas **enteras** dentro de la carpeta de tu web (`miweb/`), junto a tu `index.html`:
   ```
   miweb/
   ├─ index.html
   ├─ MiComunidad/…
   └─ MiComunidad_Demo/…
   ```
2. Enlázalas desde tu `index.html`, **con el nombre del HTML** (no existe `index.html` dentro de ellas):
   ```html
   <a href="MiComunidad/MiComunidad.html">MiComunidad</a>
   <a href="MiComunidad_Demo/MiComunidad_Demo.html">MiComunidad (DEMO)</a>
   ```
3. En GitHub Pages las direcciones quedan así (sustituye usuario y repositorio):
   - `https://USUARIO.github.io/REPOSITORIO/MiComunidad/MiComunidad.html`
   - `https://USUARIO.github.io/REPOSITORIO/MiComunidad_Demo/MiComunidad_Demo.html`

   Hace falta **HTTPS** (GitHub Pages ya lo da). Sin HTTPS no hay instalación ni funcionamiento sin conexión. Si abres el HTML directamente desde el disco (`file://`) la aplicación funciona igual, pero sin instalar ni service worker.

## Cómo instalarla

Abre la dirección de la versión que quieras (con conexión, la primera vez):

- **Windows (Chrome o Edge):** icono de instalar al final de la barra de direcciones, o menú ⋮ → «Instalar MiComunidad» (Edge: Aplicaciones → «Instalar este sitio como aplicación»).
- **Android (Chrome):** menú ⋮ → «Instalar aplicación» (o «Añadir a pantalla de inicio»).
- **iPhone/iPad (Safari, solo Safari):** botón Compartir → «Añadir a pantalla de inicio».

La completa y la DEMO se instalan por separado (tienen identificadores distintos).

## Qué cambiar en cada actualización

1. Haz los cambios en los ficheros de la carpeta que corresponda (`js/app.js`, `css/styles.css`, el HTML…). Cada versión se cambia por separado.
2. Actualiza la fecha de la versión en **`js/app.js`**: `const APP_VERSION='dd Mmm aaaa'` (es el texto «Versión …» que se ve en la ayuda).
3. Actualiza la misma fecha en **`sw.js`**: `const VERSION='aaaa-mm-dd'`. Esto es lo que hace que los dispositivos descarten la copia guardada y descarguen la nueva.
4. Si añades, renombras o quitas ficheros, ajusta la lista `FILES` de `sw.js` (todos los que aparezcan ahí deben existir, o la instalación del service worker falla). La lista no incluye `./`.
5. Sube la carpeta entera a tu web. Los usuarios reciben la versión nueva cuando abren la aplicación con conexión (a veces hace falta abrirla dos veces).

Notas:
- Los prefijos de caché son distintos y ninguno es prefijo del otro (`micomunidad-app-` y `micomunidad-demo-`): al actualizar una versión no se borra la caché de la otra ni la de otras aplicaciones de tu web.
- No cambies los nombres de los ficheros ni de las variables globales: el HTML usa `onclick` y los scripts comparten variables. Si ofuscas o minificas `js/app.js`, conserva su último bloque (el registro del service worker) y no toques `sw.js` ni el manifiesto salvo la fecha.
- `manifest.webmanifest`: `id` y `start_url` apuntan al HTML principal; `scope` es `./`. No los cambies una vez publicada la aplicación (el `id` identifica la instalación).

## Cómo funciona sin conexión

El service worker pide primero a la red y espera hasta 4 segundos; si falla o tarda más, usa la copia guardada. Sin conexión arranca al instante. Con una red muy lenta la carga puede tardar unos 8 segundos (4 s por la página y otros 4 s por el css y el js, que se piden después).

## Probarlo en local

Desde la carpeta que contiene las dos carpetas: `python -m http.server 8000` y abre `http://localhost:8000/MiComunidad/MiComunidad.html`. (`localhost` cuenta como seguro, así que el service worker funciona.)
