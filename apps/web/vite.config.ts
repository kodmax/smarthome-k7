import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import { injectPwaIcons, pwaIcons } from './vite.pwa-icons'

export default defineConfig(({ mode }) => {
  const sentryPlugins =
    mode === 'production' && process.env.SENTRY_AUTH_TOKEN
      ? [
          sentryVitePlugin({
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_WEB_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            release: { name: process.env.SENTRY_RELEASE },
            sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
          }),
        ]
      : []

  return {
    build: {
      sourcemap: mode === 'production' ? 'hidden' : false,
    },
    plugins: [
      react(),
      injectPwaIcons(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: null,
        includeAssets: pwaIcons.includeAssets,
        manifest: {
          id: '/',
          name: 'Smarthome K7',
          short_name: 'Smarthome',
          description: 'Smart home dashboard',
          start_url: '/dashboard',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          theme_color: '#2563eb',
          background_color: '#ffffff',
          icons: pwaIcons.manifestIcons,
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/phpmyadmin(\/|$)/],
          cleanupOutdatedCaches: true,
        },
      }),
      ...sentryPlugins,
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
  }
})
