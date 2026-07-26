/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import '@repo/design-tokens/theme'

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_WEBSOCKET_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
