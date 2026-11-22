/* Service worker de MiGestorDeEventos_Demo · red primero (4 s) y, si falla, lo guardado */
const VERSION='2026-11-22';                       /* actualizar en cada entrega (misma fecha que «Versión dd Mmm aaaa» del HTML) */
const PREFIJO='migestordeeventos-demo-';                            /* distinto en la versión completa y en la DEMO */
const CACHE=PREFIJO+VERSION;
const HTML_PRINCIPAL='MiGestorDeEventos_Demo.html';
const ARCHIVOS=[                                   /* NO incluye "./" */
  HTML_PRINCIPAL,
  'css/styles.css',
  'js/config.js',
  'js/app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];
const ESPERA_MS=4000;

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIJO)&&k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

/* Red con tope de espera: si tarda más de 4 s (o falla) se rechaza y se usa lo guardado */
function redConEspera(req){
  return new Promise((ok,ko)=>{
    const t=setTimeout(()=>ko(new Error('timeout')),ESPERA_MS);
    fetch(req).then(r=>{clearTimeout(t);ok(r)},er=>{clearTimeout(t);ko(er)});
  });
}

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  e.respondWith(
    redConEspera(req).then(resp=>{
      if(resp&&resp.ok&&resp.type==='basic'){const copia=resp.clone();caches.open(CACHE).then(c=>c.put(req,copia)).catch(()=>{})}
      return resp;
    }).catch(()=>
      caches.match(req,{ignoreSearch:true}).then(r=>r||(req.mode==='navigate'?caches.match(HTML_PRINCIPAL):undefined)).then(r=>r||Response.error())
    )
  );
});
