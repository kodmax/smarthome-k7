export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    return
  }

  if (import.meta.env.DEV) {
    void navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        void registration.unregister()
      }
    })
    void caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
    return
  }

  const register = () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('Service worker registration failed:', error)
    })
  }

  if (document.readyState === 'complete') {
    register()
    return
  }

  window.addEventListener('load', register, { once: true })
}
