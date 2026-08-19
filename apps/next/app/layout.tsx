import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js Playground',
  description: 'Minimal Next.js sandbox in smarthome-k7 monorepo',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='pl'>
      <body>{children}</body>
    </html>
  )
}
