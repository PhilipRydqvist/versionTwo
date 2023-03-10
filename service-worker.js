// för att kunna installera appen/sidan
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        './offline.html',
        './styles/offline.css',
        /* './styles/index.css',
        './capture.html',
        './styles/capture.css',
        './gallery.html',
        './styles/gallery.css', */
      ]);
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
    console.log('offline');
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

//med detta (staticAssets) så fungerar det ibland och ibland inte i offline läge.
//har kommenterat ut det för att offline-sidan ska komma upp

/* const staticAssets = [
  './',
  './index.html',
  './styles/index.css',
  './js/index.js',
  './capture.html',
  './js/capture.js',
  './styles/capture.css',
  './gallery.html',
  './js/gallery.js',
  './styles/gallery.css',
  './offline.html',
  './styles/offline.css',
];

self.addEventListener('install', async (event) => {
  self.skipWaiting();
  const cache = await caches.open('static-cache');
  cache.addAll(staticAssets);
}); */

async function updateCache(request) {
  const url = new URL(request.url);

  //detta behövde jag för att hemsidan fungerade inte på grund av vad jag
  //förstått det som att det berodde på olika chrome extensions som jag hade
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
