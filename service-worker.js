importScripts('workbox-sw.prod.v2.1.3.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|unpkg|jquery)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'third-party',
    cacheExpiration: {
        maxAgeSeconds: 60 * 60 * 24 * 7
    }
}));

workboxSW.router.registerRoute(/.*(?:unsplash)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'unsplash-images',
    cacheExpiration: {
        maxAgeSeconds: 60 * 60 * 24 * 30
    }
}));

workboxSW.router.registerRoute(function (routeData) {
    return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function (args) {
    return caches.match(args.event.request)
        .then(function (response) {
            if (response) {
                return response;
            }
            return fetch(args.event.request)
                .then(function (res) {
                    return res;
                })
                .catch(function (err) {
                    return caches.match('offline.html')
                        .then(function (res) {
                            return res;
                        })
                })
        })
});

workboxSW.precache([
  {
    "url": "assets/icons/icon-128x128.png",
    "revision": "c868628f85920746394b72634dfcc4f9"
  },
  {
    "url": "assets/icons/icon-144x144.png",
    "revision": "cd8497548afb834dda62757379542627"
  },
  {
    "url": "assets/icons/icon-152x152.png",
    "revision": "fe8578eb15d077ca8c61b136d721f816"
  },
  {
    "url": "assets/icons/icon-192x192.png",
    "revision": "cba69c4d0a85d58c52948906f09cc2e5"
  },
  {
    "url": "assets/icons/icon-384x384.png",
    "revision": "09e0f809670656f359124debc2f18af5"
  },
  {
    "url": "assets/icons/icon-512x512.png",
    "revision": "499374c2e19adb5ef3b3dadc7cc53412"
  },
  {
    "url": "assets/icons/icon-72x72.png",
    "revision": "18f662ec383f61bfe9db19a5a43fcec5"
  },
  {
    "url": "assets/icons/icon-96x96.png",
    "revision": "5e7bb9c1b59630a0a57a10b506ba83b8"
  },
  {
    "url": "index.css",
    "revision": "50056d7e8c83d774a110aa2c7dd4211a"
  },
  {
    "url": "index.html",
    "revision": "6eb34c40c46a6831c8ba18ed2fdba79c"
  },
  {
    "url": "index.js",
    "revision": "275f5548518c5f13c3f11e9c1561ac61"
  },
  {
    "url": "manifest.json",
    "revision": "5888a7c7d30ffbfe2e2e9e17083a648b"
  },
  {
    "url": "offline.html",
    "revision": "af1c723f6311e9f257eaef9726a32ea2"
  },
  {
    "url": "scripts/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "scripts/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "scripts/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "scripts/web-sdk-int.js",
    "revision": "42040bc754cbe8e8bbdc431d661c7b10"
  },
  {
    "url": "workbox-sw.prod.v2.1.3.js",
    "revision": "a9890beda9e5f17e4c68f42324217941"
  }
]);