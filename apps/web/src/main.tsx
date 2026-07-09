import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './style.css'
import { preventPinchZoom } from './preventPinchZoom'
import { AppThemeProvider } from './app/theme/AppThemeProvider'
import { router } from './app/router'

preventPinchZoom()

createRoot(document.getElementById('app')!).render(
  <AppThemeProvider>
    <RouterProvider router={router} />
  </AppThemeProvider>,
)
