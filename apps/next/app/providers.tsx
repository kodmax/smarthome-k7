'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { AppThemeProvider } from '@repo/styles'
import { type ReactNode } from 'react'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <AppThemeProvider defaultMode='system' ssrSafe>
        {children}
      </AppThemeProvider>
    </AppRouterCacheProvider>
  )
}
