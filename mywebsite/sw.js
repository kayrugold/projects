const CACHE_NAME = 'andy-studio-v8.104-manifests'; 
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json',
  './thechronicles/journal_manifest.json',
  // New Data Files
  './forge/forge_manifest.json',
  './market/market_manifest.json',
  // New Pages
  './pages/guild.html',
  './pages/rookery.html',
  './icon.png',
  './apps/factor-hunter.html',
  './apps/residue-scanner.html',
  './assets/icon.png',
  './assets/coffee.png',
  './assets/soundon.png',
  './assets/soundoff.png',
  './assets/fullscreen.png',
  './assets/theforge.png',
  './assets/theledger.png',
  './assets/thechronicles.png',
  './assets/theguild.png',
  './assets/therookery.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => Promise.all(keyList.map((key) => {
    if (key !== CACHE_NAME) return caches.delete(key);
  }))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
