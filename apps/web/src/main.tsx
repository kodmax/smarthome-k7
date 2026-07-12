import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './style.css'
import { preventPinchZoom } from './preventPinchZoom'
import { AppThemeProvider } from './app/theme/AppThemeProvider'
import { router } from './app/router'
import { I18nProvider } from '@/i18n'

preventPinchZoom()

createRoot(document.getElementById('app')!).render(
  <I18nProvider>
    <AppThemeProvider>
      <RouterProvider router={router} />
    </AppThemeProvider>
  </I18nProvider>,
)
