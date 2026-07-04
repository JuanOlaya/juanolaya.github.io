const CACHE_NAME = 'deutsch-lernen-v1.8';
const ASSETS_TO_CACHE = [
    './',
    './index_OLD.html',
    './index.html',
    './styles.css',
    // Verben Section
    './verben/A1_A2_B1/verben.html',
    './verben/A1_A2_B1/style/styles.css',
    './verben/A1_A2_B1/script/script.js',
    './verben/A1_A2_B1/json/verb_types.json',
    './verben/A1_A2_B1/json/verbs_index.json',
    // Falle
    './faelle/nominativ/nominativ.html',
    './faelle/akkusativ/akkusativ.html',
    './faelle/dativ/dativ.html',
    // Substantiv
    './substantiv/substantive.html',
    './substantiv/koerperteile_interaktiv.html',
    './substantiv/zeit_kalender.html',
    // Adverbs & Conectores
    './adverbs/adverbien.html',
    './adverbs/mengenpronomen.html',
    './konjunktionen/konjunktionen.html',
    // Praepositionen
    './praepositionen/praepositionen.html',
    // W-Fragen
    './w-fragen/w-fragen.html',
    // Uhrzeit
    './uhrzeit/uhrzeit.html',
    // Adjektive
    './adjektive/adjektive.html',
    // Sprechen
    './Aussprache/aussprache.html',
    './Sprechen/interjecciones.html',
    './Sprechen/a1.html',
    // Common Assets
    './images/german_flag.png'
];

// Install Event: Cache critical files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Fetch Event: Network First, Fallback to Cache
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If valid response, clone and cache it
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request);
            })
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
