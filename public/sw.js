/**
 * Service Worker for alexmayhew.dev
 * Provides offline support and caching
 */

const CACHE_NAME = "alexmayhew-v1";
const OFFLINE_URL = "/offline";

// Assets to cache on install
const PRECACHE_ASSETS = [
	"/",
	"/offline",
	"/favicon.svg",
	"/site.webmanifest",
	"/icon-192.png",
	"/icon-512.png",
];

// Install event - precache core assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_ASSETS))
			.then(() => self.skipWaiting())
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
				)
			)
			.then(() => self.clients.claim())
	);
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
	// Skip non-GET requests
	if (event.request.method !== "GET") return;

	// Skip API routes and external requests
	const url = new URL(event.request.url);
	if (url.pathname.startsWith("/api/") || url.origin !== location.origin) {
		return;
	}

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				// Clone the response for caching
				const responseClone = response.clone();

				// Cache successful responses
				if (response.status === 200) {
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseClone);
					});
				}

				return response;
			})
			.catch(() => {
				// Network failed, try cache
				return caches.match(event.request).then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse;
					}

					// For navigation requests, show offline page
					if (event.request.mode === "navigate") {
						return caches.match(OFFLINE_URL);
					}

					// Return a basic offline response for other requests
					return new Response("Offline", {
						status: 503,
						statusText: "Service Unavailable",
					});
				});
			})
	);
});
