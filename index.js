if (!window['Promise']) {
    window['Promise'] = Promise;
}
if (!window['fetch']) {
    window['fetch'] = fetch;
}

document.addEventListener('DOMContentLoaded', function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js')
            .then(function (registration) {
                console.info('ServiceWorker registration successful with scope:', registration.scope);

                // if there's no controller, this page wasn't loaded
                // via a service worker, so they're looking at the latest version.
                // In that case, exit early
                if (!navigator.serviceWorker.controller) return;

                // if there's an updated worker already waiting, update
                if (registration.waiting) {
                    console.info('show toast and upon click update...');
                    showUpdateBanner(() => {
                        registration.waiting.postMessage({
                            updateSw: true
                        });
                    });
                    return;
                }

                // if there's an updated worker installing, track its
                // progress. If it becomes "installed", update
                if (registration.installing) {
                    registration.addEventListener('statechange', function () {
                        if (registration.installing.state == 'installed') {
                            console.info('show toast and upon click update...');
                            showUpdateBanner(() => {
                                registration.installing.postMessage({
                                    updateSw: true
                                });
                            })
                            return;
                        }
                    });
                }

                // otherwise, listen for new installing workers arriving.
                // If one arrives, track its progress.
                // If it becomes "installed", update
                registration.addEventListener('updatefound', function () {
                    let newServiceWorker = registration.installing;

                    newServiceWorker.addEventListener('statechange', function () {
                        if (newServiceWorker.state == 'installed') {
                            console.info('show toast and upon click update...');
                            showUpdateBanner(() => {
                                newServiceWorker.postMessage({
                                    updateSw: true
                                });
                            })
                        }
                    });
                });
            })
            .catch(function (error) {
                console.info('ServiceWorker registration failed:', error);
            });


        navigator.serviceWorker.addEventListener('controllerchange', function () {
            window.location.reload();
        });
    } else {
        console.log('service worker not supported!!');
    }
});

showUpdateBanner = cb => {
    let updateContainer = document.querySelector('.update');
    let updateBtn = document.querySelector('.update-btn');
    updateBtn.remove();
    let btn = document.createElement('btn');
    btn.classList.add('update-btn');
    if (!updateContainer.classList.contains('show')) {
        updateContainer.classList.remove('hide');
        updateContainer.classList.add('show');
    }
    btn.addEventListener('click', () => {
        console.log('update clicked');
        updateContainer.classList.remove('show');
        updateContainer.classList.add('hide');
        if (cb && typeof cb == 'function') {
            cb();
        }
    });
}