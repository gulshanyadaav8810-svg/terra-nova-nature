/* ==========================================================
   NATURE MOMENTS — PROGRESSIVE WEB APP SERVICE WORKER
   Enables 100% installable web app ("Add to Home Screen"),
   offline shell caching, and instant automatic background updates.
   ========================================================== */

const CACHE_NAME = 'nature-moments-cache-v2.3';
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/logo.png',
  './assets/splash-bg.png'
];

// Install: Cache critical app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[PWA SW] Pre-cache non-fatal error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA SW] Removing stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for API/JSON & Stale-While-Revalidate for app code
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET or cross-origin video streaming requests (let native video handle partial byte ranges)
  if (request.method !== 'GET') return;
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm') || url.hostname.includes('pinimg.com')) {
    return;
  }

  // Network-First for dynamic data & APIs
  if (url.pathname.includes('/api/') || url.pathname.includes('reels.json')) {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkRes;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-While-Revalidate for HTML, JS, CSS, and images
  event.respondWith(
    caches.match(request).then((cachedRes) => {
      const fetchPromise = fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkRes;
        })
        .catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
