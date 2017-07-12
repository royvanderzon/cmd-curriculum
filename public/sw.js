// self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
// self.addEventListener('fetch', function(event) {
//     console.log(event.request.url)
//     // event.respondWith(new Response('hijacked'))
// })
// console.log('ready to serve!');

self.addEventListener('install', event => event.waitUntil(
    caches.open('cmd-core')
    .then(cache => cache.addAll([
        '/',
        '/cms/css/quill.snow.css',
        '/site/css/main.css',
        '/site/js/quill.js',
        '/site/js/qr.js',
        '/site/js/smoothscroll.js',
        '/site/js/wiquery.js',
        '/site/js/main.js'
    ]))
    .then(self.skipWaiting())
));

self.addEventListener('fetch', event => {

    caches.open('cmd-pages').then(function(cache) {
        // console.log(cache)
    })

    // console.log(event)
    const request = event.request;
    if (request.mode === 'navigate') {
        getAllCachedPages(request)
        event.respondWith(
            fetch(request)
            .then(response => cachePage(request, response))
            .catch(err => getCachedPage(request))
            .catch(err => fetchCoreFile('/'))
        );
    } else {
        event.respondWith(
            fetch(request)
            .catch(err => fetchCoreFile(request.url))
            .catch(err => fetchCoreFile('/'))
        );
    }
});

function fetchCoreFile(url) {
    return caches.open('cmd-core')
        .then(cache => cache.match(url))
        .then(response => response ? response : Promise.reject());
}

function getCachedPage(request) {
    caches.open('cmd-pages').then(function(cache) {
        // console.log(cache)
    })
    return caches.open('cmd-pages')
        .then(cache => cache.match(request))
        .then(response => response ? response : Promise.reject());
}

function cachePage(request, response) {
    const clonedResponse = response.clone();
    caches.open('cmd-pages')
        .then(cache => cache.put(request, clonedResponse));
    return response;
}

function getAllCachedPages(request) {
    caches.open('cmd-pages').then(function(cache) {
        // console.log('senddd')
        send_message_to_all_clients(cache)
    })
}

function send_message_to_client(client, msg) {
    return new Promise(function(resolve, reject) {

        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function(event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        client.postMessage(JSON.parse(JSON.stringify(msg)), [msg_chan.port2]);
    });
}

function send_message_to_all_clients(msg) {
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            send_message_to_client(client, msg).then(m => console.log(m));
        })
    })
}






// register service worker
// navigator.serviceWorker.register('service-worker-cache-images.js', { scope: './' })
//     .then(navigator.serviceWorker.ready)
//     .then(function() {
//         console.log('service worker registered')
//     })
//     .catch(function(error) {
//         console.log('error when registering service worker', error, arguments)
//     });

// this is the service worker which intercepts all http requests
self.addEventListener('fetch', function fetcher(event) {
    var request = event.request;
    // check if request 
    if (request.url.indexOf('assets.contentful.com') > -1) {
        // contentful asset detected
        event.respondWith(
            caches.match(event.request).then(function(response) {
                // return from cache, otherwise fetch from network
                return response || fetch(request);
            })
        );
    }
    // otherwise: ignore event
});
