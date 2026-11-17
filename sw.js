/* Abuev — service worker.
   ВАЖНО: после каждого обновления файлов меняйте VERSION (например, v3, v4),
   иначе браузер может показывать старую версию из кэша. */

const VERSION = "abuev-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./lang.js",
  "./data.js",
  "./update.js",
  "./animations.js",
  "./app.js",
  "./manifest.json",
  "./logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch(() => {
            /* один отсутствующий файл не должен ломать установку */
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // API и шрифты — мимо кэша

  /* Навигация: сеть в приоритете, при офлайне отдаём index.html */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html").then((hit) => hit || caches.match("./")))
    );
    return;
  }

  /* Остальное: сразу из кэша + тихое обновление (stale-while-revalidate) */
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
