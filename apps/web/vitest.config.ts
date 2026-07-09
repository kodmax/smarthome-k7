import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const srcDir = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: [
        {
          find: '@/card-components',
          replacement: path.resolve(srcDir, 'src/pages/Dashboard/cards/components'),
        },
        {
          find: '@',
          replacement: path.resolve(srcDir, 'src'),
        },
      ],
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      exclude: [...configDefaults.exclude, 'dist/**'],
    },
  }),
)
