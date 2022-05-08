const filesToCache = [
	'./'
];

const staticCacheName = 'ATHERD-cache';

this.addEventListener('install', event => {
	console.log('Attempting to install service worker and cache static assets');
	event.waitUntil(
		caches.open(staticCacheName)
		.then(cache => {
			return cache.addAll(filesToCache);
		})
	);
});

this.addEventListener('fetch', function (event) {
	console.log('Fetch event for ', event.request.url);
	event.respondWith(
		caches.match(event.request)
		.then(response => {
			if (response) {
				console.log('Found ', event.request.url, ' in cache');
				return response;
			}
			console.log('Network request for ', event.request.url);
			return fetch(event.request)
			.then(response => {
				return caches.open(staticCacheName).then(cache => {
					cache.put(event.request.url, response.clone());
					return response;
				});
			});

		}).catch(error => {

			// TODO 6 - Respond with custom offline page

		})
	);
});