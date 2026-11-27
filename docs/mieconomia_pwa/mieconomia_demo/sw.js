/*! MiEconomía · © 2026 CristianFG · Todos los derechos reservados */
/* Service worker: guarda los ficheros de la app para que funcione sin conexión.
   Estrategia: red primero (con 4 s de espera) y, si falla, lo guardado. Así las actualizaciones llegan solas.
   Se salta la caché HTTP del navegador (GitHub Pages la guarda unos 10 min) tanto al guardar como al pedir ficheros.
   El nombre de la caché lleva la versión: se renueva en cada cambio publicado. */
const CACHE='mieconomia-demo-26Nov2026b';
const FICHEROS=['MiEconomia_Demo.html','css/styles.css','js/config.js','js/app.js','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FICHEROS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mieconomia-demo-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    try{
      const res=await Promise.race([fetch(r.url,{cache:'no-cache'}),new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),4000))]);
      if(res&&res.ok)c.put(r,res.clone());
      return res;
    }catch(err){
      const hit=await c.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await c.match('MiEconomia_Demo.html'):null);
      if(hit)return hit;
      throw err;
    }
  })());
});
