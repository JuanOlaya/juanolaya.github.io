/// <reference lib="webworker" />
/**
 * MemoDeutsch service worker, built by vite-plugin-pwa (injectManifest) into
 * `dist/Deutsch_lernen/service-worker.js`: the same URL as the hand-written worker it replaces, so every
 * existing registration picks it up as an ordinary update.
 */
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute, type PrecacheEntry } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { RUNTIME_CACHE, isLegacyCacheName } from './caches.ts';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: (string | PrecacheEntry)[] };

// Replace the old worker at once instead of waiting for every MemoDeutsch tab to close.
void self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();
// Legacy pages load their scripts with cache-busting queries (`script.js?v=1.85`); the precache has them without.
precacheAndRoute(self.__WB_MANIFEST, { ignoreURLParametersMatching: [/.*/] });

// Everything else keeps the old worker's behaviour: network first, cached copy when offline.
registerRoute(
  ({ request, url }) => request.method === 'GET' && url.origin === self.location.origin,
  new NetworkFirst({ cacheName: RUNTIME_CACHE }),
);

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter(isLegacyCacheName).map((name) => caches.delete(name)))),
  );
});
