const CACHE_NAME = 'offline';
const OFFLINE_URL = 'index.html';

self.addEventListener('install', function(event) {
  
  event.waitUntil((async () => {
    const e = await caches.open(CACHE_NAME);
    await e.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
  
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {

        const e = await caches.open(CACHE_NAME);
        const edResponse = await cache.match(OFFLINE_URL);
        return edResponse;
      }
    })());
  }
});
