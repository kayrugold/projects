// The name of your cache. Change the version number (v1 to v2) 
// if you ever update the HTML/CSS so the browser knows to pull the new version.
const CACHE_NAME = 'andys-looper-v1';

// The exact files the app needs to run offline
const ASSETS_TO_CACHE = [
    './',
    './andysaudiolooper.html',
    './manifest.json',
    './icon.svg'
];

// --- 1. INSTALL EVENT: Pre-cache everything ---
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installing system...');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching core assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting(); 
});

// --- 2. ACTIVATE EVENT: Clean up old versions ---
self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activating new system...');
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Purging old cache:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// --- 3. FETCH EVENT: The "Offline-First" Interceptor ---
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // If the file is in the cache, return it immediately
            if (cachedResponse) {
                console.log('[Service Worker] Serving from cache:', e.request.url);
                return cachedResponse;
            }

            // If not in cache, try to fetch from the network
            return fetch(e.request).then((networkResponse) => {
                // Optional: You can dynamically cache new things here if you want, 
                // but for a single-page app, returning the network response is fine.
                return networkResponse;
            }).catch(() => {
                // If the network fails AND it's not in the cache, 
                // this is where you'd normally show a custom "Offline" HTML page.
                console.log('[Service Worker] Network request failed and no cache available.');
            });
        })
    );
});
