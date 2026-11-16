const CACHE_NAME = 'htmlappcleaner-v3';
const APP_SHELL = [
  './HtmlAppCleaner.html',
  './htmlappcleaner.webmanifest',
  './icons/htmlappcleaner.svg',
  './css/app.css',
  './js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  const appUrl = new URL('./HtmlAppCleaner.html', self.location.href);
  const manifestUrl = new URL('./htmlappcleaner.webmanifest', self.location.href);
  const iconUrl = new URL('./icons/htmlappcleaner.svg', self.location.href);
  const cssUrl = new URL('./css/app.css', self.location.href);
  const jsUrl = new URL('./js/app.js', self.location.href);
  const isAppPage = request.mode === 'navigate' && url.pathname === appUrl.pathname;
  if (!isAppPage && url.pathname !== manifestUrl.pathname && url.pathname !== iconUrl.pathname && url.pathname !== cssUrl.pathname && url.pathname !== jsUrl.pathname) return;
  event.respondWith(
    fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match(request).then(cached => cached || (isAppPage ? caches.match('./HtmlAppCleaner.html') : Response.error())))
  );
});
