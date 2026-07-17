import { registerSW } from 'virtual:pwa-register'

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

  registerSW({ immediate: true })
}
