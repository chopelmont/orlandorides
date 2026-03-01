// Nombre de la versión (Cámbialo a v1.3 cada vez que subas cambios)
const CACHE_NAME = 'chopel-v1.2.1';

// LISTA DE ARCHIVOS (Esto es lo que te faltaba para que sea instalable)
const assets = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// 1. Instalación: Guarda los archivos básicos en el teléfono
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assets);
        })
    );
    self.skipWaiting();
});

// 2. Activación: Limpia el "index viejo" y versiones antiguas
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
    self.clients.claim();
});

// 3. Estrategia: Buscar siempre lo más nuevo en Internet
// Si no hay internet, usa lo que guardó en el paso 1
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});