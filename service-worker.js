/* fetch(url, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  },
}); */

// för att kunna installera appen/sidan
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(['Offline.html', './styles/index.css']);
    })
  );

  self.skipWaiting();
  console.log('Installed service worker at ', new Date().toLocaleTimeString());
});

self.addEventListener('activate', (event) => {
  self.skipWaiting();
  console.log('Activated service worker at ', new Date().toLocaleTimeString());
});

self.addEventListener('fetch', async (event) => {
  console.log(event.request.url);
  if (!navigator.onLine) {
    // Kolla om vi har internet eller ej, ger tillbaka true/false
    console.log('Offline');
    event.respondWith(
      caches.match(event.request).then((response) => {
        console.log('RESPONSE:', response);
        if (response) {
          return response;
        } else {
          return caches.match(new Request('offline.html'));
        }
      })
    );
  } else {
    console.log('Online');
    const response = await updateCache(event.request);
    return response;
  }
});
console.log('update', updateCache);

async function updateCache(request) {
  const url = new URL(request.url);

  if (
    url.protocol === 'chrome-extension:' ||
    url.pathname.includes('extension') ||
    url.protocol !== 'http:' ||
    url.protocol !== 'https:'
  ) {
    return;
  }

  const response = await fetch(request);
  const cache = await caches.open('v1');

  cache.put(request, response.clone());
  return response;
}

console.log('update2', updateCache);
