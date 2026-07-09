import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@repo/design-tokens'
import { type FC, type ReactNode } from 'react'
import { COLOR_MODE_STORAGE_KEY, getStoredColorMode } from './colorMode'

type AppThemeProviderProps = {
  children: ReactNode
}

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const storedMode = getStoredColorMode()

  return (
    <ThemeProvider
      theme={theme}
      defaultMode={storedMode ?? 'system'}
      modeStorageKey={COLOR_MODE_STORAGE_KEY}
      disableTransitionOnChange
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
