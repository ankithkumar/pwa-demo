const staticCache = "demo-app-static-v8";
const dynamicCache = "demo-app-dynamic-v8";

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
    'https://fonts.googleapis.com/css?family=Karla:400,700|Open+Sans:300,400,600,700|Roboto',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'manifest.json',
    'offline.html',
    "scripts/material.min.js",
    "scripts/load-images.js",
    "scripts/web-sdk-int.js"
];

const dynamicFileToCache = [
    "images.unsplash.com"
]

self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCache)
        .then(cache => cache.addAll(filesToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(async function () {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
            console.log('found response in cache!');
            return cachedResponse;
        }
        return fetch(event.request)
            .then(res => updateCache(event.request, res))
            .catch(err => {
                return caches.open(staticCache)
                    .then(cache => {
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return cache.match(OFFLINE_URL)
                        }
                    })
            })
    }());
});

self.addEventListener('activate', (event) => {
    console.log('service worker activated');
    event.waitUntil(
        caches.keys()
        .then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== staticCache && key !== dynamicCache) {
                    console.log('deleting cache ', key);
                    return caches.delete(key);
                }
            }))
        }));
    self.clients.claim();
});

self.addEventListener('message', function (e) {
    console.log('message ', e.data);
    if (e.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

function updateCache(request, response) {
    let concatArr = dynamicFileToCache;
    let flag = false;
    for (let i = 0; i < concatArr.length; i++) {
        if (request.url.indexOf(concatArr[i]) !== -1) {
            flag = true;
            break;
        }
    }
    if (!flag) {
        return response;
    }
    return caches.open(dynamicCache)
        .then(cache => {
            cache.put(request, response.clone());
            return response;
        });
}


function getRelativeUrl(url) {
    return url.replace(/^(?:\/\/|[^/]+)*\//, '');
}