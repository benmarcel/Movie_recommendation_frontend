const  cacheName = 'my-cache-v1';
const urlToCache = ['index.html', 'offline.html'];
const self = this;
// install sw
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Caching URLs:', urlToCache);
      return cache.addAll(urlToCache);
    })
  );
});
// listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If a cached response is found, return it
      if (response) {
        return response;
      }
      // Otherwise, fetch from the network
      return fetch(event.request).catch(() => {
        // If the network request fails, return the offline page
        return caches.match('offline.html');
      });
    })
  );
});

// activate sw
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(cacheName);
  // Delete old caches that are not in the whitelist        
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});