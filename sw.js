const cacheName = "demo-app-v1"
const OFFLINE_URL = 'offline.html';
const INIT_PAGE = 'index.html';
const filesToCache = [
    '/',
    'index.html',
    'index.css',
    'index.js',
    'assets/icons/icon-72x72.png',
    'assets/icons/icon-96x96.png',
    'assets/icons/icon-128x128.png',
    'assets/icons/icon-144x144.png',
    'assets/icons/icon-152x152.png',
    'assets/icons/icon-192x192.png',
    'assets/icons/icon-384x384.png',
    'assets/icons/icon-512x512.png',
    'manifest.json',
    'offline.html',
    "scripts/fetch.js",
    "scripts/promise.js",
    "scripts/load-images.js",
    "scripts/web-sdk-int.js"
];

const dynamicCache = [
    "images.unsplash.com"
]

self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                // First, try to use the navigation preload response if it's supported.
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                const networkResponse = await fetch(event.request);
                if (networkResponse.status > 400) {
                    throw 'failed';
                }
                return networkResponse;
            } catch (error) {
                // let relativeURl = getRelativeUrl(event.request.url);
                // catch is only triggered if an exception is thrown, which is likely
                // due to a network error.
                // If fetch() returns a valid HTTP response with a response code in
                // the 4xx or 5xx range, the catch() will NOT be called.

                // if (relativeURl === '') {
                //     const cache = await caches.open(cacheName);
                //     const cachedResponse = await cache.match(INIT_PAGE);
                //     return cachedResponse;
                // } else {

                console.log('Fetch failed; returning offline page instead.', error);
                const cache = await caches.open(cacheName);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
                // }
            }
        })());
    } else {
        event.respondWith(async function () {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                console.log('found response!');
                return cachedResponse;
            }
            return fetch(event.request).then(updateCache(event.request));
        }());
    }
});

self.addEventListener('activate', (event) => {
    let keys = caches.keys();
    if (keys.then && typeof keys.then === "function") {
        event.waitUntil(keys.then((keyList) => {
            Promise.all(keyList.map((key) => {
                if (key === cacheName) {
                    return;
                }
                caches.delete(key);
            }))
        })());
    }
});

self.addEventListener('message', function (e) {
    console.log('message ', e.data);
    if (e.data.updateSw) {
        self.skipWaiting();
    }
});

function updateCache(request) {
    let concatArr = [...filesToCache, ...dynamicCache];
    let flag = false;
    for (let i = 0; i < concatArr.length; i++) {
        if (request.url.indexOf(concatArr[i]) !== -1) {
            flag = true;
            break;
        }
    }
    if (!flag) {
        return;
    }
    return caches.open(cacheName).then(cache => {
        return fetch(request).then(response => {
            const resClone = response.clone();
            if (response.status < 400)
                return cache.put(request, resClone);
            return response;
        });
    });
}


function getRelativeUrl(url) {
    return url.replace(/^(?:\/\/|[^/]+)*\//, '');
}