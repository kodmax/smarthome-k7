import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serviceRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(serviceRoot, '../..')

const SentryCli = createRequire(join(serviceRoot, 'package.json'))('@sentry/cli')

const main = async () => {
  if (!process.env.SENTRY_AUTH_TOKEN) {
    console.log('[sentry] skipped (missing SENTRY_AUTH_TOKEN)')
    return
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
    return
  }

  const cli = new SentryCli()

  console.log('[sentry] injecting debug IDs into', sourcemapDirs.length, 'directories')
  await cli.execute(['sourcemaps', 'inject', ...sourcemapDirs], true)

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
  await cli.execute(uploadArgs, true)

  console.log('[sentry] done')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
