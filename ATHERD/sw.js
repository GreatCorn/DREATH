const staticCacheName = 'ATHERD-cache';

this.addEventListener('install', function (event){
	console.log("Attempting to install service worker and cache static assets.");
	event.waitUntil(
		caches.open(staticCacheName)
		.then(cache => {
			return cache.addAll(['./manifest.json', './', './res.gcr']);
		})
	);
});

this.addEventListener('fetch', function (event){
	//I DON'T FUCKING KNOW HOW SERVICE WORKERS WORK
	if (navigator.onLine){
		event.waitUntil(caches.open(staticCacheName).then(function(cache){
				cache.delete('./res.gcr').then(function(response){
					cache.add('./res.gcr');
				});
				cache.delete('./').then(function(response){
					cache.add('./');
				});
			})
		);
		return;
	}
	//rawFile.send(null);
	console.log("Fetch event for ", event.request.url);
	event.respondWith(
		caches.match(event.request)
		.then(response => {
			if (response) {
				console.log("Found ", event.request.url, " in cache.");
				return response;
			}
			console.log("Network request for ", event.request.url);
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

this.addEventListener('activate', function (event){
	console.log("Activated ", event);
});

console.log("Service worker launched.");