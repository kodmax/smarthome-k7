import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { type FC, type ReactNode } from 'react'
import { type AppColorMode, COLOR_MODE_STORAGE_KEY, getStoredColorMode } from './colorMode'
import { theme } from './theme'

type AppThemeProviderProps = {
  children: ReactNode
  defaultMode?: AppColorMode
  /** Skip localStorage read on mount — use for Next.js SSR. */
  ssrSafe?: boolean
}

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children, defaultMode = 'system', ssrSafe = false }) => {
  const resolvedDefaultMode = ssrSafe ? defaultMode : (getStoredColorMode() ?? defaultMode)

  return (
    <ThemeProvider
      theme={theme}
      defaultMode={resolvedDefaultMode}
      modeStorageKey={COLOR_MODE_STORAGE_KEY}
      disableTransitionOnChange
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
