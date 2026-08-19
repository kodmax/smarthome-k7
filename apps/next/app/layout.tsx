import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { COLOR_MODE_STORAGE_KEY } from '@repo/styles/colorMode'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import '@repo/styles/reset.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Next.js Playground',
  description: 'Minimal Next.js sandbox in smarthome-k7 monorepo',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='pl' suppressHydrationWarning>
      <head>
        <InitColorSchemeScript modeStorageKey={COLOR_MODE_STORAGE_KEY} defaultMode='system' attribute='class' />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
