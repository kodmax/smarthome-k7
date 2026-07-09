import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { RouterProvider } from 'react-router-dom'
import './style.css'
import { preventPinchZoom } from './preventPinchZoom'
import { theme } from '@repo/design-tokens'
import { router } from './app/router'

preventPinchZoom()

createRoot(document.getElementById('app')!).render(
  <ThemeProvider theme={theme} defaultMode='system'>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>,
)
