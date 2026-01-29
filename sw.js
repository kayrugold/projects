const CACHE_NAME = 'andys-forge-v4.53'; // Change this string to force an update for users
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css?v=4.53',
  './app.js?v=4.53',
  './manifest.json',
  
  // --- CORE PAGES (So tabs work offline) ---
  './pages/guild.html',
  './pages/rookery.html',

  // --- DATA MANIFESTS (So lists load offline) ---
  './forge/forge_manifest.json',
  './market/market_manifest.json',
  './thechronicles/journal_manifest.json',

  // --- UI ICONS (The App Shell) ---
  './assets/icon.png',
  './assets/icon_home.png',
  './assets/icon_forge.png',
  './assets/icon_market.png',
  './assets/icon_chronicles.png',
  './assets/icon_guild.png',
  './assets/icon_raven.png',
  './assets/soundoff.png',
  './assets/soundon.png',
  './assets/coffee.png',      // Added: Coffee icon (it's always on the navbar)
  './assets/fullscreen.png'   // Added: Fullscreen button
];

// 1. INSTALL: Cache the "App Shell" immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force this SW to become active immediately
});

// 2. ACTIVATE: Clean up old caches (Delete v4.0 if we are on v4.1)
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
  self.clients.claim(); // Take control of all pages immediately
});

// 3. FETCH: The Traffic Cop
self.addEventListener('fetch', (event) => {
  
  // STRATEGY A: For HTML pages and JSON (Content) -> Network First, then Cache
  // We want users to see the latest projects/bugs if they are online.
  if (event.request.headers.get('accept').includes('text/html') || 
      event.request.url.includes('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network works, cache the new version and return it
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // If offline, return the cached version
          return caches.match(event.request);
        })
    );
  } 
  
  // STRATEGY B: For Images, CSS, JS -> Cache First, then Network
  // These files rarely change, so load them from disk instantly.
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          // If we had to go to the network, cache it for next time
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        });
      })
    );
  }
});
