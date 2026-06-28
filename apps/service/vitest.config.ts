import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

const srcDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      { find: '@/utils', replacement: path.resolve(srcDir, 'src/data-sources/utils') },
      { find: '@', replacement: path.resolve(srcDir, 'src') },
    ],
  },
  test: {
    setupFiles: ['./src/test/setupEnv.ts'],
    exclude: [...configDefaults.exclude, 'dist/**'],
  },
})
