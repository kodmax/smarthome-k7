import { registerSW } from 'virtual:pwa-register'
import { isDevelopment } from '@/env'

export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    return
  }

  if (isDevelopment) {
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
