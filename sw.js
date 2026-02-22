// sw.js - Automated Service Worker v4.8.7
importScripts('config.js');

const ASSETS_TO_CACHE = [
  './',
  getVersionedAsset('./index.html'),
  getVersionedAsset('./style.css'),
  getVersionedAsset('./app.js'),
  getVersionedAsset('./embers.js'),
  './manifest.json',

  // --- CORE PAGES ---
  './pages/guild.html',
  './pages/rookery.html',

  // --- DATA MANIFESTS ---
  getVersionedAsset('./forge/forge_manifest.json'),
  getVersionedAsset('./market/market_manifest.json'),
  getVersionedAsset('./thechronicles/journal_manifest.json'),

  // --- UI ICONS (UPDATED TO WEBP) ---
  './assets/icon.webp',
  './assets/icon_home.webp',
  './assets/icon_forge.webp',
  './assets/icon_market.webp',
  './assets/icon_chronicles.webp',
  './assets/icon_guild.webp',
  './assets/icon_raven.webp',
  './assets/soundoff.webp',
  './assets/soundon.webp',
  './assets/coffee.webp',
  './assets/fullscreen.webp'
];

// 1. INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`[Service Worker] Caching Forge v${FORGE_VERSION}`);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH
self.addEventListener('fetch', (event) => {
  if (event.request.headers.get('accept').includes('text/html') ||
    event.request.url.includes('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        });
      })
    );
  }
});
