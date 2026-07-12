import { theme } from '@repo/design-tokens'
import { ThemeProvider } from '@mui/material/styles'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'
import { I18nProvider } from '@/i18n'

const TestProviders = ({ children }: { children: ReactNode }) => (
  <I18nProvider initialLocale='pl'>
    <ThemeProvider theme={theme} defaultMode='dark'>
      {children}
    </ThemeProvider>
  </I18nProvider>
)

export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult {
  return render(ui, { wrapper: TestProviders, ...options })
}

export * from '@testing-library/react'
