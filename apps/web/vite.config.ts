import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Smarthome K7',
        short_name: 'Smarthome',
        description: 'Smart home dashboard',
        start_url: '/dashboard',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#646cff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    proxy: {
      '/ws': {
        target: 'ws://127.0.0.1:3678',
        ws: true,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@/card-components',
        replacement: fileURLToPath(new URL('./src/pages/Dashboard/cards/components', import.meta.url)),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
})
