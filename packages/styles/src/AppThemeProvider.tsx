import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { type FC, type ReactNode, useMemo } from 'react'
import { type AppColorMode, COLOR_MODE_STORAGE_KEY, getStoredColorMode } from './colorMode'
import { theme } from './theme'

type AppThemeProviderProps = {
  children: ReactNode
  defaultMode?: AppColorMode
  /** Skip localStorage read on mount — use for Next.js SSR. */
  ssrSafe?: boolean
  /** Override theme fontFamily — e.g. next/font `inter.style.fontFamily`. */
  fontFamily?: string
}

export const AppThemeProvider: FC<AppThemeProviderProps> = ({
  children,
  defaultMode = 'system',
  ssrSafe = false,
  fontFamily,
}) => {
  const resolvedDefaultMode = ssrSafe ? defaultMode : (getStoredColorMode() ?? defaultMode)
  const resolvedTheme = useMemo(
    () => (fontFamily ? createTheme(theme, { typography: { fontFamily } }) : theme),
    [fontFamily],
  )

  return (
    <ThemeProvider
      theme={resolvedTheme}
      defaultMode={resolvedDefaultMode}
      modeStorageKey={COLOR_MODE_STORAGE_KEY}
      disableTransitionOnChange
    >
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
