const CACHE_NAME = "nattapart-portfolio-v15";
const BASE = new URL("./", self.location.href);
const FILES = [
  "index.html",
  "portfolio.html",
  "certificates.html",
  "contact.html",
  "style.css",
  "assets/css/site-theme.css",
  "assets/css/work.css",
  "assets/css/tailwind-built.css",
  "assets/css/fonts.css",
  "assets/css/icons.css",
  "assets/js/common.js",
  "assets/js/projects.js",
  "assets/js/contact.js",
  "projects.json",
  "certificates.json",
  "favicon.ico",
];
self.addEventListener("install", (event) =>
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(FILES.map((path) => new URL(path, BASE).href)),
      )
      .then(() => self.skipWaiting()),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("nattapart-portfolio-") &&
                key !== CACHE_NAME,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== BASE.origin ||
    !url.pathname.startsWith(BASE.pathname)
  )
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok && response.type === "basic")
          await cache.put(request, response.clone());
        return response;
      } catch {
        const match = await cache.match(request);
        return (
          match ||
          new Response(
            "This page is unavailable offline. Please reconnect and reload.",
            {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            },
          )
        );
      }
    })(),
  );
});
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
