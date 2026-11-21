# MiEconomía · PWA (versión 18 Nov 2026)

© 2026 CristianFG · Todos los derechos reservados

Dos carpetas independientes:

- `MiEconomia_Demo/` → versión DEMO (`MiEconomia_Demo.html`), la que se publica en la web pública.
- `MiEconomia/` → versión completa (`MiEconomia.html`), no se publica en la web pública.

Estructura de cada carpeta:

- `MiEconomia.html` / `MiEconomia_Demo.html` → fichero principal (rutas relativas a todo lo demás).
- `css/styles.css`
- `js/app.js` y `js/config.js` (única diferencia de código entre versiones: `const DEMO`)
- `icons/` → iconos
- `manifest.webmanifest` y `sw.js` → en la raíz de la carpeta a propósito (el service worker solo controla su carpeta y las inferiores).

## Publicar la DEMO en https://paraotros88.github.io/miweb/
1. Copia la carpeta **entera** `MiEconomia_Demo/` (con `css/`, `js/` e `icons/`) dentro del repositorio `miweb`, como subcarpeta. Si vas a ofuscar, hazlo antes sobre los ficheros de la carpeta, sin cambiar nombres ni rutas.
2. En el `index.html` de la web, enlaza al fichero con su nombre:
   `<a href="MiEconomia_Demo/MiEconomia_Demo.html">MiEconomía (DEMO)</a>`
3. Dirección final:
   `https://paraotros88.github.io/miweb/MiEconomia_Demo/MiEconomia_Demo.html`

Cada app de la web tiene su propio `sw.js`, que solo controla su subcarpeta; el `index.html` de la web no se ve afectado.

## Instalar
- Chrome / Edge (Windows y Android): icono de instalar en la barra de direcciones o menú → «Instalar aplicación».
- iPhone / iPad (Safari): Compartir → «Añadir a pantalla de inicio».

## Al hacer cambios
- Actualizar el texto «Versión dd Mmm aaaa» del HTML principal.
- Actualizar la versión en el nombre de la caché de `sw.js` (`CACHE`).
- Probar desde `http://localhost` o HTTPS (abriendo el HTML con doble clic la app funciona, pero sin instalación ni modo sin conexión).
