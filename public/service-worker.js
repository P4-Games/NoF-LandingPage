try {
  const PRECACHE = "nof-pre-cache-v" + new Date().getTime()
  const RUNTIME = "nof-runtime-cache-v" + new Date().getTime()
  const API_BACKEND = 'https://nof.town/api'
  const FONTS = 'https://fonts.googleapis.com/'
  const NEXT = '/_next/'

  // A list of local resources we always want to be cached.
  const PRECACHE_URLS = [
    `/images/favicon/favicon-16x16.png`,
    `/images/favicon/favicon-32x32.png`,
    `/locales/br/common.json`,
    `/locales/br/web3_onboard.json`,
    `/locales/en/common.json`,
    `/locales/en/web3_onboard.json`,
    `/locales/es/common.json`,
    `/locales/es/web3_onboard.json`,
    `/music/Dungeon.mp3`,
    '/_offline'
  ]

  // The install handler takes care of precaching the resources we always need.
  self.addEventListener("install", (event) => {
    // console.log("SW installing")
    event.waitUntil(
      caches.open(PRECACHE)
        .then((cache) => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    )
  })

  // The activate handler takes care of cleaning up old caches.
  self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME]
    // console.log("SW activate cache")
    event.waitUntil(
      caches.keys().then((cacheNames) => cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))).then((cachesToDelete) => {
        // console.log("SW cache is deleting")
        return Promise.all(cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete)))
      }).then(() => self.clients.claim())
    )
  })


  // The fetch handler serves responses for same-origin resources from a cache.
  // If no response is found, it populates the runtime cache with the response
  // from the network before returning it to the page.
  //console.log('next', self.location.origin & NEXT)
  self.addEventListener("fetch", (event) => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (
        (event.request.url.startsWith(self.location.origin) ||
        event.request.url.startsWith(API_BACKEND) ||
        event.request.url.startsWith(FONTS) ) &&
        !event.request.url.startsWith(self.location.origin & NEXT) &&
        !event.request.method === 'POST') {

      // console.log('SW calling: ', event.request.url)
      try {
        event.respondWith(
          caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }

            return caches.open(RUNTIME).then((cache) => fetch(event.request, {}).then((response) => 
                // console.log('SW get from cache: ', event.request.url)
                // Put a copy of the response in the runtime cache.
                 cache.put(event.request, response.clone()).then(() => response)
              ))
          })
        )
      } catch (error) {
        console.error('SW ERROR calling: ', event.request.url)
        return fetch(event.request, {}).then((response) => response)
      }

    } else {
      // console.log('**SW Skiping: ', event.request.url)
    }

  })
} catch (e) {
  console.error(e)
}
