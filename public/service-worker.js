try {
  const PRECACHE = "nof-pre-cache-v" + new Date().getTime()
  const RUNTIME = "nof-runtime-cache-v" + new Date().getTime()
  const API_BACKEND_URL = 'https://nof.town/api'
  const STORAGE_BACKEND_URL = 'https://storage.googleapis.com'
  const FONTS1_URL = 'https://fonts.googleapis.com'
  const FONTS2_URL = 'https://fonts.gstatic.com'
  const NEXT_FOLDER = '/_next/'
  const IMAGES_FOLDER = `/images/`
  const LOCALES_FOLDER = `/locales/`
  const MUSIC_FOLDER = `/music/`

  // The install handler takes care of precaching the resources we always need.
  self.addEventListener("install", (event) => {
    const fetchFilesFromFolder = async (folder, extensions) => {
      try {
        const fileList = [];
  
        const response = await fetch(folder);
        if (response.ok) {
          const text = await response.text();
          const urls = text.match(/href="([^"]+)"/g);
      
          if (urls) {
            urls.forEach((url) => {
              const fileName = url.match(/href="([^"]+)"/)[1];
              const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      
              if (extensions.includes(fileExtension)) {
                const fileURL = `${folder}${fileName}`;
                fileList.push(fileURL);
              }
            });
          }
        }
        return fileList;
    
      } catch (ex) {
        console.error("SW error 1", ex)
      }
    }

    try {
      console.log("SW installing")

      event.waitUntil(
        Promise.all([
          fetchFilesFromFolder(IMAGES_FOLDER, ['png', 'jpg', 'jpeg', 'gif']),
          fetchFilesFromFolder(LOCALES_FOLDER, ['json']),
          fetchFilesFromFolder(MUSIC_FOLDER, ['mp3'])
        ]).then((fileURLs) => {
          const allFiles = fileURLs.flat();
          allFiles.push('/_offline')
          allFiles.push('/index')
          allFiles.push('/alpha')
          allFiles.push('/gamma')
          return caches.open(PRECACHE).then((cache) => cache.addAll(allFiles));
        }).then(self.skipWaiting())
      );

    } catch (ex) {
      console.error("SW error 2", ex, event.request.url)
    }
  })

  // The activate handler takes care of cleaning up old caches.
  self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME]
    // console.log("SW activate cache")
    event.waitUntil(
      caches.keys().then((cacheNames) => cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))).then((cachesToDelete) => 
        // console.log("SW cache is deleting")
         Promise.all(cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete)))
      ).then(() => self.clients.claim())
    )
  })


  // The fetch handler serves responses for same-origin resources from a cache.
  // If no response is found, it populates the runtime cache with the response
  // from the network before returning it to the page.
  //console.log('next', self.location.origin & NEXT)
  self.addEventListener("fetch", (event) => {
    const isGet = event.request.method === 'GET'
    const isHttp = event.request.url.startsWith('http')
    const isHttps = event.request.url.startsWith('https')
    const isOriginUrl = event.request.url.startsWith(self.location.origin)
    const isBackendUrl = event.request.url.startsWith(API_BACKEND_URL)
    const isStorageBackendUrl = event.request.url.startsWith(STORAGE_BACKEND_URL)
    const isFonts1Url = event.request.url.startsWith(FONTS1_URL)
    const isFonts2Url = event.request.url.startsWith(FONTS2_URL)
    const isValidToCache = (isGet && (isHttp || isHttps) && 
      (isOriginUrl || isBackendUrl || isFonts1Url || isFonts2Url || isStorageBackendUrl))

    if (!isValidToCache) {
      if (!event.request.url.startsWith(self.location.origin + NEXT_FOLDER))
        console.log('**SW Skiping 1: ', event.request.url)
      return 
    }

    // Respond with cached resources from the precache, if they exist
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        // If the resource is not in cache, fetch it from the network
        return fetch(event.request).then((response) => 
          // Cache the fetched resources for future use
           caches.open(RUNTIME).then((cache) => {
            try {
              cache.put(event.request, response.clone());
            } catch (ex) {
              console.error ('SW put in cache error', event.request.url, ex)
            }
            return response;
          })
        )

      }).catch(() => {
        // If an error occurs while fetching from the cache or network, 
        // respond with an offline page or an appropriate fallback response
        console.error('SW ERROR calling: ', event.request.url)
        return caches.match('/_offline')
      })
    )
  })
} catch (e) {
  console.error("SW general error", e)
}
