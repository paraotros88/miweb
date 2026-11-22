/* Service worker de MiComunidad - DEMO · © 2026 CristianFG
   Red primero (4 s de espera) y, si falla, lo guardado. */
const PREFIX='micomunidad-demo-';          /* prefijo propio de esta versión: no puede ser prefijo de otro */
const VERSION='2026-11-21';              /* cambiar con cada versión nueva (fecha de la versión) */
const CACHE=PREFIX+VERSION;
const FILES=[
  'MiComunidad_Demo.html','css/styles.css','js/config.js','js/app.js','manifest.webmanifest',
  'icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'
];
const TIMEOUT=4000;
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    try{
      const res=await Promise.race([fetch(r),new Promise((_,ko)=>setTimeout(()=>ko(new Error('timeout')),TIMEOUT))]);
      if(res&&res.ok&&res.type==='basic')c.put(r,res.clone());
      return res;
    }catch(err){
      const hit=await c.match(r,{ignoreSearch:true});
      if(hit)return hit;
      if(r.mode==='navigate'){const p=await c.match('MiComunidad_Demo.html');if(p)return p}
      throw err;
    }
  })());
});
