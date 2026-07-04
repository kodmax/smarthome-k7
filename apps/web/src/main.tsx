import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import './style.css'
import { Dashboard } from './Dashboard'
import { theme } from '@repo/design-tokens'

createRoot(document.getElementById('app')!).render(
  <ThemeProvider theme={theme} defaultMode='dark'>
    <CssBaseline />
    <Dashboard />
  </ThemeProvider>,
)
