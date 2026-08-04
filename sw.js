const VERSION = 'v2';
const STATIC_CACHE = `kwa-static-${VERSION}`;
const TILE_CACHE = `kwa-tiles-${VERSION}`;
const DATA_CACHE = `kwa-data-${VERSION}`;
const PHOTO_CACHE = `kwa-photos-${VERSION}`;
const ALL_CACHES = [STATIC_CACHE, TILE_CACHE, DATA_CACHE, PHOTO_CACHE];

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !ALL_CACHES.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isAppShell = APP_SHELL.some((path) => url.pathname.endsWith(path.replace('./', '/')));

  // App shell: cache-first
  if (isAppShell) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
    return;
  }

  // Map tiles (Google's tile endpoint): cache-first, so previously-viewed
  // areas of the map stay visible offline. Tile responses are "opaque"
  // (cross-origin, no-cors) but can still be cached and replayed.
  const isMapTile = /(^|\.)google\.com$/.test(url.hostname) && url.pathname === '/vt';
  if (isMapTile) {
    event.respondWith(
      caches.open(TILE_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((res) => {
            cache.put(event.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Mural photos (same-origin /images/ folder, or any external photo URL
  // used in the sheet): cache-first, so viewed photos work offline.
  const isPhoto = url.pathname.includes('/images/') || /\.(jpe?g|png|webp)$/i.test(url.pathname);
  if (isPhoto) {
    event.respondWith(
      caches.open(PHOTO_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((res) => {
            cache.put(event.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Google Sheet mural data (CSV): network-first, falling back to the last
  // successfully loaded version if offline.
  const isSheetData = url.searchParams.get('output') === 'csv' || url.hostname.includes('googleusercontent.com');
  if (isSheetData) {
    event.respondWith(
      fetch(event.request).then((res) => {
        caches.open(DATA_CACHE).then((cache) => cache.put(event.request, res.clone()));
        return res;
      }).catch(() =>
        caches.open(DATA_CACHE).then((cache) => cache.match(event.request))
      )
    );
    return;
  }

  // Everything else (OSRM routing, etc.) — network only, no caching.
  // Directions inherently need a live connection.
});
