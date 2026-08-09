import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serviceRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(serviceRoot, '../..')

if (!process.env.SENTRY_AUTH_TOKEN) {
  console.log('[sentry] skipped (missing SENTRY_AUTH_TOKEN)')
  process.exit(0)
}

const sourcemapDirs = [
  join(serviceRoot, 'dist'),
  join(repoRoot, 'packages/apollo-ws/dist'),
  join(repoRoot, 'packages/feeds/dist'),
  join(repoRoot, 'packages/db/dist'),
  join(repoRoot, 'packages/chronos/dist'),
  join(repoRoot, 'packages/cron-scripts/dist'),
  join(repoRoot, 'packages/common/dist'),
  join(repoRoot, 'packages/logger/dist'),
  join(repoRoot, 'packages/env/dist'),
  join(repoRoot, 'packages/di/dist'),
  join(repoRoot, 'packages/transmission/dist'),
  join(repoRoot, 'packages/knx-schema/dist'),
  join(repoRoot, 'packages/types/dist'),
].filter(dir => existsSync(dir))

if (sourcemapDirs.length === 0) {
  console.log('[sentry] skipped (no dist directories found)')
  process.exit(0)
}

const sentryCli = join(serviceRoot, 'node_modules/@sentry/cli/bin/sentry-cli')
const env = {
  ...process.env,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  SENTRY_ORG: process.env.SENTRY_ORG,
}

const run = (args) => {
  execFileSync(sentryCli, args, { stdio: 'inherit', env })
}

console.log('[sentry] injecting debug IDs into', sourcemapDirs.length, 'directories')
run(['sourcemaps', 'inject', ...sourcemapDirs])

const uploadArgs = [
  'sourcemaps',
  'upload',
  ...sourcemapDirs,
  '--org',
  process.env.SENTRY_ORG,
  '--project',
  process.env.SENTRY_SERVICE_PROJECT,
]

if (process.env.SENTRY_RELEASE) {
  uploadArgs.push('--release', process.env.SENTRY_RELEASE)
}

console.log('[sentry] uploading sourcemaps')
run(uploadArgs)

console.log('[sentry] done')
