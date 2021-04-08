if (!window['Promise']) {
    window['Promise'] = Promise;
}
if (!window['fetch']) {
    window['fetch'] = fetch;
}

showUpdateBanner = cb => {
    console.log('showing button');
    let updateContainer = document.querySelector('.update');
    let updateBtn = document.querySelector('.update-btn');
    updateBtn.remove();
    let btn = document.createElement('button');
    btn.textContent = 'update app';
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
    updateContainer.appendChild(btn);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(function (reg) {
            console.info('ServiceWorker registration successful with scope:', reg.scope);

            if (!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.waiting) {
                console.log('new service worker waiting');
                updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                console.log('new service worker waiting');
                trackInstalling(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', function () {
                console.log('new service worker update found');
                trackInstalling(reg.installing);
            });
        })
        .catch(error => {
            console.error('sw registration failed!', error);
        });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        console.log('controller change!', refreshing);
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
} else {
    console.error('sw not supported', error);
}

function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
            .then(registration => {
                for (let i = 0; i < registration.length; i++) {
                    registration[i].unregister();
                }
                setTimeout(() => window.location.reload());
            })
    }
}

function updateReady(worker) {
    showUpdateBanner(() => {
        unregisterServiceWorker();
        // worker.postMessage({
        //     action: 'skipWaiting'
        // });
    })
}

function trackInstalling(worker) {
    worker.addEventListener('statechange', function () {
        if (worker.state == 'installed') {
            updateReady(worker);
        }
    });
};