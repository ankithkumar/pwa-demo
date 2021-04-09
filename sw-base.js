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

workboxSW.precache([]);