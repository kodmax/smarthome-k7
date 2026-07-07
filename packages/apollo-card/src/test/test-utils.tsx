import { theme } from '@repo/design-tokens'
import { ThemeProvider } from '@mui/material/styles'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { type ReactElement, type ReactNode } from 'react'

const TestProviders = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme} defaultMode='dark'>
    {children}
  </ThemeProvider>
)

export function renderWithTheme(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult {
  return render(ui, { wrapper: TestProviders, ...options })
}

export * from '@testing-library/react'
