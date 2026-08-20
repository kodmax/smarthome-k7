import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@repo/styles/reset.css'
import { AppThemeProvider } from '@repo/styles'
import { preventPinchZoom } from './preventPinchZoom'
import { GlobalErrorBoundary, initSentry } from './app/errors'
import { initOpenTelemetry } from './telemetry/initOpenTelemetry'
import { registerServiceWorker } from './app/registerServiceWorker'
import { router } from './app/router'
import { I18nProvider } from '@/i18n'
import { isDevelopment } from '@repo/env'

if (isDevelopment) {
  console.info(`[app] ${import.meta.env.MODE} mode`)
}

initOpenTelemetry()
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
