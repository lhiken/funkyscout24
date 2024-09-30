const addResourcesToCache = async (resources: Iterable<RequestInfo>) => {
   const cache = await caches.open("v1");
   await cache.addAll(resources);
};


self.addEventListener("install", (event) => {
   event.waitUntil(
      addResourcesToCache([
         "main.tsx",
         "auth.tsx"

      ]).then(() => {
         console.log('All resources cached!');
      }).catch((error) => {
         console.error('Caching failed:', error);
      }))
});
self.addEventListener('activate', event => {
   console.log('Service Worker activating...');
});
self.addEventListener('fetch', (event) => {
   event.respondWith(caches.match(event.request));
});
