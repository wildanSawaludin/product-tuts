var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  'index.html',
  'fallback.json',
  'css/main.css',
  'js/jquery.min.js',
  'js/main.js',
  'images/logo.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('in install serviceworker... cache opened!');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function(event) {

  var request = event.request
  var url = new URL(request.url)

  //Pisahkan Request API dan Internal
  if (url.origin === location.origin) {

    event.respondWith(
      //console.log(event.request)
      caches.match(request).then(function(response){
        return response || fetch(request)
      })

    )

  } else {

    event.respondWith(
      caches.open('products-chace').then(function(cache){
        return fetch(request).then(function(liveResponse){
          cache.put(request, liveResponse.clone())
          return liveResponse
        }).catch(function(){
          return caches.match(request).then(function(response){
            if (response) return response
            return caches.match('fallback.json')
          })
        })
      })
    )

  }
});


self.addEventListener('activate', function(event) {
	//Activation SW
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName){
        	return cacheName != CACHE_NAME
        }).map(function(cacheName){
        	return caches.delete(cacheName)
        })
      );
    })
  );
});