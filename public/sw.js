/**
 * AL-ARRIQI INVERCOOL - Service Worker
 * Designed for reliable caching of critical application assets, static project images,
 * and essential catalog data during intermittent internet connectivity common in remote regions.
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `arriqi-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `arriqi-static-${CACHE_VERSION}`;
const IMAGES_CACHE = `arriqi-images-${CACHE_VERSION}`;
const DATA_CACHE = `arriqi-data-${CACHE_VERSION}`;

const ALL_CACHES = [SHELL_CACHE, STATIC_CACHE, IMAGES_CACHE, DATA_CACHE];

// Core shell assets to precache immediately on install
const PRECACHE_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-icon.svg',
  '/logo-icon.png',
  '/logo.png',
  '/logo-full.jpg',
  '/images/panel-cover.jpg',
  '/robots.txt'
];

// Maximum cached images to avoid unbounded storage usage on low-storage mobile devices
const MAX_IMAGE_ENTRIES = 120;

async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      // Remove oldest items first
      await Promise.all(
        keys.slice(0, keys.length - maxItems).map((key) => cache.delete(key))
      );
    }
  } catch (err) {
    console.warn('[SW] Cache trim error:', err);
  }
}

// -------------------------------------------------------------
// 1. Install Event: Precache Application Shell
// -------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => {
        return Promise.all(
          PRECACHE_SHELL_ASSETS.map((assetUrl) => {
            return cache.add(assetUrl).catch((err) => {
              console.warn('[SW] Precache failed for:', assetUrl, err);
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// -------------------------------------------------------------
// 2. Activate Event: Clean up outdated cache versions
// -------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!ALL_CACHES.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// -------------------------------------------------------------
// 3. Fetch Event: Intelligent Strategy per Request Type
// -------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests (mutations, submissions, uploads)
  if (request.method !== 'GET') {
    return;
  }

  // Bypass chrome extensions or non-http protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Exclude admin mutation & authentication routes from caching
  if (url.pathname.startsWith('/api/auth')) {
    return;
  }

  // --- A. Navigation Requests (HTML / Page routing) ---
  // Network-First with Cache Fallback to /index.html for offline SPA navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          const cachedShell = await caches.match('/index.html');
          if (cachedShell) return cachedShell;

          return caches.match('/');
        })
    );
    return;
  }

  // --- B. Static Project Images & Visual Media ---
  // Cache-First with Network Fallback to guarantee fast loading in remote regions
  const isImageRequest =
    request.destination === 'image' ||
    /\.(png|jpg|jpeg|svg|webp|gif|ico)(\?.*)?$/i.test(url.pathname) ||
    url.hostname.includes('unsplash.com') ||
    url.pathname.startsWith('/uploads/');

  if (isImageRequest) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request, { mode: 'cors' })
          .then((networkResponse) => {
            // Cache successful or opaque responses (Unsplash / CDN)
            if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
              const clone = networkResponse.clone();
              caches.open(IMAGES_CACHE).then((cache) => {
                cache.put(request, clone);
                trimCache(IMAGES_CACHE, MAX_IMAGE_ENTRIES);
              });
            }
            return networkResponse;
          })
          .catch(async () => {
            // If offline and image not in cache, fallback to logo-icon or SVG placeholder
            const fallbackLogo = await caches.match('/logo-icon.png');
            if (fallbackLogo) return fallbackLogo;
            return new Response('', { status: 408, statusText: 'Image unavailable offline' });
          });
      })
    );
    return;
  }

  // --- C. Public Read-Only API Endpoints ---
  // Network-First with Cache Fallback: keeps services, projects & gallery cached for remote areas
  const isPublicApi =
    url.pathname === '/api/services' ||
    url.pathname.startsWith('/api/services/') ||
    url.pathname === '/api/projects' ||
    url.pathname.startsWith('/api/projects/') ||
    url.pathname === '/api/gallery' ||
    url.pathname === '/api/settings' ||
    url.pathname === '/api/reviews' ||
    url.pathname === '/api/faq' ||
    url.pathname === '/api/governates';

  if (isPublicApi) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedData = await caches.match(request);
          if (cachedData) {
            return cachedData;
          }
          return new Response(JSON.stringify([]), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          });
        })
    );
    return;
  }

  // --- D. Static JS/CSS Bundles & Web Fonts ---
  // Stale-While-Revalidate: deliver immediately from cache and update in background
  const isStaticBundle =
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticBundle) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => null);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // --- E. All other GET requests: Default Network with Cache Fallback ---
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
