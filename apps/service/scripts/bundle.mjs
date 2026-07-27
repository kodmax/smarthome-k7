import * as esbuild from 'esbuild'
import { sentryEsbuildPlugin } from '@sentry/bundler-plugins/esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serviceRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const watch = process.argv.includes('--watch')

const plugins = []

if (process.env.SENTRY_AUTH_TOKEN) {
  plugins.push(
    sentryEsbuildPlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_SERVICE_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: process.env.SENTRY_RELEASE ? { name: process.env.SENTRY_RELEASE } : undefined,
      sourcemaps: {
        assets: ['./dist/index.js'],
      },
    }),
  )
}

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: [join(serviceRoot, 'src/index.ts')],
  outfile: join(serviceRoot, 'dist/index.js'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  sourcemap: true,
  target: 'node18',
  plugins,
  alias: {
    '@/utils': join(serviceRoot, 'src/data-sources/utils'),
    '@': join(serviceRoot, 'src'),
  },
  logLevel: 'info',
}

if (watch) {
  const context = await esbuild.context(buildOptions)
  await context.watch()
  console.log('[bundle] watching…')
} else {
  await esbuild.build(buildOptions)
}
