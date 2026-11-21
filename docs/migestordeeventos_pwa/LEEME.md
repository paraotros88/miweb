# MiGestorDeEventos · PWA (versión completa y DEMO)

© 2026 CristianFG · Todos los derechos reservados

## 1. Estructura

Dos carpetas **independientes** (no comparten ningún fichero):

```
MiGestorDeEventos/            ← versión completa
  MiGestorDeEventos.html      ← página principal (NO es index.html)
  manifest.webmanifest   ← datos de instalación (id y start_url = MiGestorDeEventos.html)
  sw.js                  ← service worker (funcionamiento sin conexión)
  css/styles.css
  js/config.js           ← solo: const DEMO=false;
  js/app.js              ← la aplicación (+ registro del service worker al final)
  icons/                 ← icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png (180x180)

MiGestorDeEventos_Demo/       ← versión DEMO (misma estructura)
  MiGestorDeEventos_Demo.html
  ... (js/config.js contiene: const DEMO=true;  e iconos con la banda «DEMO»)
```

- Orden de carga en el HTML: `js/config.js` y después `js/app.js`.
- La aplicación se llamaba antes «EventManager»: el nombre cambia en pantalla, ayuda, ficheros y carpetas, pero se mantienen los nombres internos de las bases de datos para no perder datos, y las copias de seguridad antiguas se siguen pudiendo importar.
- Las bases de datos del navegador conservan sus nombres de siempre (`eventmanager2026` y `eventmanager2026demo`), así que **no se pierden datos** al pasar de un único HTML a la PWA **si se abre desde el mismo origen (misma dirección web)**. Ojo: si antes la app se usaba desde otra dirección (otro dominio o desde un fichero local), los datos de ese origen no se ven desde la nueva; usa Exportar/Importar en Backup.
- Los límites de la DEMO (2 agrupaciones, 4 tareas, 6 meses, sin exportar/importar) siguen estando dentro de `js/app.js` de la DEMO, como antes; `config.js` solo declara la constante `DEMO`.

## 2. Publicar dentro de tu web (GitHub Pages)

Las carpetas **no son la raíz de un repositorio propio**: se copian dentro de tu web.

1. En tu repositorio de la web (`miweb`), copia las dos carpetas **enteras** junto a tu `index.html`:
   ```
   miweb/
     index.html
     MiGestorDeEventos/
     MiGestorDeEventos_Demo/
   ```
2. Enlázalas desde tu `index.html`. Como la página principal **no se llama index.html**, el enlace debe incluir el nombre del fichero:
   ```html
   <a href="MiGestorDeEventos/MiGestorDeEventos.html">MiGestorDeEventos</a>
   <a href="MiGestorDeEventos_Demo/MiGestorDeEventos_Demo.html">MiGestorDeEventos (DEMO)</a>
   ```
3. Haz commit y push. Con GitHub Pages la dirección será, por ejemplo:
   - `https://TU_USUARIO.github.io/miweb/MiGestorDeEventos/MiGestorDeEventos.html` (repositorio de proyecto), o
   - `https://TU_USUARIO.github.io/MiGestorDeEventos/MiGestorDeEventos.html` (si `miweb` es `TU_USUARIO.github.io`).
4. Requisito: la web debe servirse por **HTTPS** (GitHub Pages ya lo hace). Abierta desde `file://` la app funciona, pero **no** se registra el service worker ni se puede instalar.

Cada service worker solo controla su carpeta (y subcarpetas), así que la completa y la DEMO no se interfieren entre sí ni con el resto de tu web.

## 3. Instalar

Abre la dirección de la app (la del paso 2) en el navegador:

- **Windows (Chrome o Edge):** icono de instalar en la barra de direcciones (o menú ⋮ → *Instalar MiGestorDeEventos* / *Aplicaciones → Instalar*).
- **Android (Chrome):** menú ⋮ → *Instalar aplicación* (o *Añadir a pantalla de inicio*).
- **iPhone/iPad (Safari):** botón Compartir → *Añadir a pantalla de inicio*. **Importante en iOS:** Safari y la app instalada tienen almacenamiento **separado**; los datos que tengas en Safari no aparecen en la app instalada. Exporta una copia en Safari e impórtala en la app instalada.

## 4. Qué cambiar en cada actualización

Aplica el mismo cambio en las dos carpetas (conservando lo propio de la DEMO) y, en **cada** carpeta:

1. `MiGestorDeEventos.html` / `MiGestorDeEventos_Demo.html`: el texto `Versión dd Mmm aaaa` del pie → fecha del día.
2. `sw.js`: la constante `VERSION` (formato `aaaa-mm-dd`, misma fecha). Con ella cambia el nombre de la caché (`migestordeeventos-full-AAAA-MM-DD` / `migestordeeventos-demo-AAAA-MM-DD`) y al activarse se borran las cachés antiguas del mismo prefijo.
3. Si añades o renombras ficheros, actualiza también la lista `ARCHIVOS` de `sw.js` (no debe incluir `"./"`).
4. Sube las carpetas a `miweb`. Los usuarios reciben la versión nueva al abrir la app con conexión (red primero, 4 s de espera; si falla, se usa lo guardado). A veces hace falta abrirla una segunda vez para verla.

Estrategia del service worker: red primero con 4 segundos de espera y, si falla o tarda más, lo guardado en caché.
