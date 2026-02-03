// sw.js - Automated Service Worker
importScripts('config.js'); // This pulls in FORGE_VERSION and CACHE_NAME

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

  // --- UI ICONS (App Shell) ---
  './assets/icon.jpg',
  './assets/icon_home.jpg',
  './assets/icon_forge.jpg',
  './assets/icon_market.jpg',
  './assets/icon_chronicles.jpg',
  './assets/icon_guild.jpg',
  './assets/icon_raven.jpg',
  './assets/soundoff.jpg',
  './assets/soundon.jpg',
  './assets/coffee.jpg',
  './assets/fullscreen.jpg'
];

// 1. INSTALL: Cache everything under the new Master Version
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`[Service Worker] Caching Forge v${FORGE_VERSION}`);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); 
});

// 2. ACTIVATE: Clean up old versions automatically
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); 
});

// 3. FETCH: Traffic Cop
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
