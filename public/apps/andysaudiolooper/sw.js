const CACHE_NAME = 'andys-looper-v3'; // Bumped to v3 to force update

const ASSETS_TO_CACHE = [
    './andysaudiolooper.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// NETWORK-FIRST STRATEGY
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((networkResponse) => {
                // If the network works, return the fresh file!
                return networkResponse;
            })
            .catch(() => {
                // If the network FAILS (user is offline), look in the cache
                return caches.match(e.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If the exact URL isn't in cache, but it's a page navigation, force the HTML file
                    if (e.request.mode === 'navigate') {
                        return caches.match('./andysaudiolooper.html');
                    }
                });
            })
    );
});
