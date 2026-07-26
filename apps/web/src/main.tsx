import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './style.css'
import { preventPinchZoom } from './preventPinchZoom'
import { GlobalErrorBoundary, initSentry } from './app/errors'
import { registerServiceWorker } from './app/registerServiceWorker'
import { AppThemeProvider } from './app/theme/AppThemeProvider'
import { router } from './app/router'
import { I18nProvider } from '@/i18n'
import { isDevelopment } from '@/env'

if (isDevelopment) {
  console.info(`[app] ${import.meta.env.MODE} mode`)
}

initSentry()
preventPinchZoom()
registerServiceWorker()

createRoot(document.getElementById('app')!).render(
  <I18nProvider>
    <AppThemeProvider>
      <GlobalErrorBoundary>
        <RouterProvider router={router} />
      </GlobalErrorBoundary>
    </AppThemeProvider>
  </I18nProvider>,
)
