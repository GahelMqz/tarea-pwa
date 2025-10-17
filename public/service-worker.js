// Nombre del caché
const CACHE_NAME = 'mi-pwa-cache-v1';

// Archivos que se van a cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
];

// Evento de instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2 Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  console.log('Service Worker: Activado');
  clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché vieja: ', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3 Interceptar peticiones (modo offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, lo devuelve. Si no, va a la red.
        return response || fetch(event.request);
      })
  );
});

