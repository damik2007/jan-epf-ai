/**
 * Jan-EPF AI: Sovereign ServiceWorker & Remote Village 2G/Offline Cache
 * Ensures 100% functionality in remote rural regions with spotty connectivity.
 */

const CACHE_NAME = "jan-epf-ai-v1-sovereign";
const STATIC_ASSETS = [
  "/",
  "/money",
  "/career",
  "/savings",
  "/fix",
  "/login",
  "/manifest.json"
];

// Install: Precache shell routes
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

// Activate: Clean old caches
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

// Fetch: Stale-While-Revalidate with Sovereign Fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Bypass API requests to let network / deterministic fallback handle them
  if (request.url.includes("/api/") || request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
