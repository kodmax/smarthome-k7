'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { AppThemeProvider } from '@repo/styles'
import { type ReactNode } from 'react'
import { I18nProvider, type AppLocale } from '@/i18n'

type ProvidersProps = {
  children: ReactNode
  initialLocale: AppLocale
  fontFamily: string
}

export function Providers({ children, initialLocale, fontFamily }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <I18nProvider initialLocale={initialLocale}>
        <AppThemeProvider defaultMode='system' ssrSafe fontFamily={fontFamily}>
          {children}
        </AppThemeProvider>
      </I18nProvider>
    </AppRouterCacheProvider>
  )
}
