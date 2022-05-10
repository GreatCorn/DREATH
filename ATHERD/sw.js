const staticCacheName = 'ATHERD-cache';

this.addEventListener('install', function (event){
	console.log("Attempting to install service worker and cache static assets.");
	event.waitUntil(
		caches.open(staticCacheName)
		.then(cache => {
			return cache.addAll(['./', './res.gcr']);
		})
	);
});

this.addEventListener('fetch', function (event){
	//I DON'T FUCKING KNOW HOW SERVICE WORKERS WORK
	console.log(event);
	console.log("Fetch event for ", event.request.url);
	event.respondWith(caches.match(event.request).then(function(response){
			if (response) {
				let fname = event.request.url.substring(event.request.url.lastIndexOf('/')+1);
				if(((fname == 'res.gcr') || (fname == '')) && navigator.onLine){
					console.log(event.request.url);
					caches.open(staticCacheName).then(function(cache){
						cache.delete(event.request.url).then(function(response){
							cache.add(event.request.url);
							console.log("Updated ", event.request.url);
						});
					});
				}
				else{
					console.log("Found ", event.request.url, " in cache.");
					return response;
				}
			}
			console.log("Network request for ", event.request.url);
			return fetch(event.request).then(function(response){
				return caches.open(staticCacheName).then(function(cache){
					cache.put(event.request.url, response.clone());
					return response;
				});
			});

		})
	);
});

this.addEventListener('activate', function (event){
	console.log("Activated ", event);
});

console.log("Service worker launched.");