import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import './style.css'
import { Dashboard } from './Dashboard'
import { preventPinchZoom } from './preventPinchZoom'
import { theme } from '@repo/design-tokens'

preventPinchZoom()

createRoot(document.getElementById('app')!).render(
  <ThemeProvider theme={theme} defaultMode='system'>
    <CssBaseline />
    <Dashboard />
  </ThemeProvider>,
)
