/**
 * Jan-EPF AI: Sovereign ServiceWorker (Network-First for HTML, Cache-First for Offline)
 * Guarantees zero stale deployments while preserving offline resilience.
 */

const CACHE_NAME = "jan-epf-ai-v2-fresh";
const STATIC_ASSETS = [
  "/manifest.json"
];

// Install: Precache manifest
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[Jan-EPF PWA] Asset precache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Purge all old caches immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network-First for HTML/Pages, Stale-While-Revalidate for Assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Bypass API requests
  if (request.url.includes("/api/") || request.method !== "GET") {
    return;
  }

  // Network-First for HTML page navigation (ensures latest version always loads)
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-While-Revalidate for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);
      return cachedResponse || fetchPromise;
    })
  );
});
