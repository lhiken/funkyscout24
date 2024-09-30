
const addResourcesToCache = async (resources: Iterable<RequestInfo>) => {
   const cache = await caches.open("v1");
   await cache.addAll(resources);
};

const urlToCache = [
   "main.tsx",
   "./app/auth/auth.tsx"
]


self.addEventListener("install", (event) => {
   event.waitUntil(
      addResourcesToCache(
         urlToCache
      ).then(() => {
         console.log('All resources cached!');
      }).catch((error) => {
         console.error('Caching failed:', error);
      }))
});

self.addEventListener('fetch', (event) => {
   console.log(`hi, ${event.request.url}`); 
   /*event.respondWith(
      caches.match(event.request)
      .then(response =>{
         return response || fetch(event.request);
      })
   )*/
});