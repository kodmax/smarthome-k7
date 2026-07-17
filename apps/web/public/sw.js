const CACHE_NAME = 'smarthome-k7-v3'

async function cacheShell(cache) {
  try {
    const response = await fetch('/', { cache: 'reload' })
    if (response.ok) {
      await cache.put('/', response.clone())
      await cache.put('/index.html', response.clone())
    }
  } catch {
    await cache.add('/index.html')
  }
}

async function matchShell() {
  return (await caches.match('/index.html')) || (await caches.match('/'))
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cacheShell(cache))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put('/index.html', responseClone))
          return response
        })
        .catch(() => matchShell()),
    )
    return
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone))
        }
        return response
      })
      .catch(() => caches.match(event.request)),
  )
})
