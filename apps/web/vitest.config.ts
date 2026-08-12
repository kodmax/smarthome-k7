import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ConfigEnv } from 'vite'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const srcDir = path.dirname(fileURLToPath(import.meta.url))

const resolvedViteConfig =
  typeof viteConfig === 'function' ? viteConfig({ mode: 'test', command: 'serve' } satisfies ConfigEnv) : viteConfig

export default mergeConfig(
  resolvedViteConfig,
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
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.ts'],
      exclude: [...configDefaults.exclude, 'dist/**'],
    },
  }),
)
