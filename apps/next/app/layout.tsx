import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { COLOR_MODE_STORAGE_KEY } from '@repo/styles/colorMode'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { AppShell } from '@/app/shell/AppShell'
import { getRequestLocale } from '@/i18n/getRequestLocale'
import { Providers } from './providers'
import '@repo/styles/reset.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Smarthome',
  description: 'Smarthome dashboard (Next.js)',
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getRequestLocale()

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <head>
        <InitColorSchemeScript modeStorageKey={COLOR_MODE_STORAGE_KEY} defaultMode='system' attribute='class' />
      </head>
      <body>
        <Providers initialLocale={locale} fontFamily={inter.style.fontFamily}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
