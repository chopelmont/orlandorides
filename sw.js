// Nombre de la versión (Cámbialo a v1.3, v1.4, etc., cada vez que subas cambios al index)
const CACHE_NAME = 'chopel-v1.2';

// 1. Instalación: Obliga al Service Worker a tomar el control de inmediato
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. Activación: Aquí es donde ocurre la magia que limpia el "index viejo"
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Toma el control de las pestañas abiertas inmediatamente
    self.clients.claim();
});

// 3. Estrategia: Buscar siempre lo más nuevo en la red (Internet)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});