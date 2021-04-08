const staticCache = "demo-app-static-v2";
const dynamicCache = "demo-app-dynamic-v2";

const OFFLINE_URL = 'offline.html';
const INIT_PAGE = 'index.html';
const staticFilesToCache = [
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
    'https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css',
    'https://code.jquery.com/jquery-3.2.1.slim.min.js',
    'https://unpkg.com/popper.js@1.12.6/dist/umd/popper.js',
    'https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js',
    'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
    'manifest.json',
    'offline.html',
    "scripts/web-sdk-int.js"
];

const dynamicFileToCache = [
    "images.unsplash.com"
]

self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCache)
        .then(cache => cache.addAll(staticFilesToCache))
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