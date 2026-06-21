const CACHE = 'aktien-check-v1';
const SHELL = [
  '/Aktien-Check/',
  '/Aktien-Check/manifest.json',
  '/Aktien-Check/icon-192.png',
  '/Aktien-Check/icon-512.png',
  '/Aktien-Check/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.destination === 'document') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/Aktien-Check/')));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
