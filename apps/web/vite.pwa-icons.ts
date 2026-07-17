import type { Plugin } from 'vite'
import pwaIcons from './src/generated/pwa-icons.json'

export function injectPwaIcons(): Plugin {
  return {
    name: 'inject-pwa-icons',
    transformIndexHtml(html) {
      return html
        .replace(/<link rel="icon"[^>]*>\s*/i, '')
        .replace(/<link rel="apple-touch-icon"[^>]*>\s*/i, '')
        .replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="${pwaIcons.favicon}" />
    <link rel="apple-touch-icon" href="${pwaIcons.appleTouchIcon}" />`,
        )
    },
  }
}

export { pwaIcons }
