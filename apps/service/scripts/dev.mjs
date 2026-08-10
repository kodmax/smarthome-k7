import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, watch } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serviceRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(serviceRoot, '../..')
const srcDir = join(serviceRoot, 'src')
const swcBin = join(serviceRoot, 'node_modules/.bin/swc')
const tscAliasBin = join(serviceRoot, 'node_modules/.bin/tsc-alias')
const DEP_RESTART_DEBOUNCE_MS = 300
const REBUILD_DEBOUNCE_MS = 150

let nodeProcess
let hasStarted = false
let depRestartTimer
let rebuildTimer
let rebuildPending = false

const repoPackageNames = () => {
  const pkgJson = JSON.parse(readFileSync(join(serviceRoot, 'package.json'), 'utf8'))
  return Object.keys(pkgJson.dependencies ?? {}).flatMap(name => {
    if (!name.startsWith('@repo/')) {
      return []
    }

    return [name.slice('@repo/'.length)]
  })
}

const runTscAlias = () => {
  try {
    execSync(`"${tscAliasBin}" -p tsconfig.json`, { cwd: serviceRoot, stdio: 'inherit' })
    return true
  } catch {
    console.error('[dev] tsc-alias failed — path aliases in dist may be stale')
    return false
  }
}

const compileService = () => {
  try {
    execSync(`"${swcBin}" src -d dist --strip-leading-paths --config-file .swcrc`, {
      cwd: serviceRoot,
      stdio: 'inherit',
    })
    return true
  } catch {
    console.error('[dev] compile failed — fix errors above; watcher still running')
    return false
  }
}

const startNode = () => {
  nodeProcess?.kill('SIGTERM')

  nodeProcess = spawn('node', ['-r', './dist/otel-instrumentation.js', './dist/index.js'], {
    cwd: serviceRoot,
    stdio: 'inherit',
  })
}

const rebuildService = ({ immediate = false } = {}) => {
  if (rebuildPending) {
    return
  }

  clearTimeout(rebuildTimer)

  const run = () => {
    rebuildPending = true

    try {
      if (!compileService()) {
        return
      }

      runTscAlias()

      if (!hasStarted) {
        hasStarted = true
        startNode()
        console.log('[dev] ready — watching apps/service/src and @repo/*/dist')
      } else {
        console.log('[dev] recompiled — restarting service…')
        startNode()
      }
    } finally {
      rebuildPending = false
    }
  }

  if (immediate) {
    run()
    return
  }

  rebuildTimer = setTimeout(run, REBUILD_DEBOUNCE_MS)
}

const scheduleDepRestart = packageName => {
  if (!hasStarted) {
    return
  }

  clearTimeout(depRestartTimer)
  depRestartTimer = setTimeout(() => {
    console.log(`[dev] @repo/${packageName} dist changed — restarting service…`)
    startNode()
  }, DEP_RESTART_DEBOUNCE_MS)
}

const watchRepoPackageDist = packageName => {
  const distDir = join(repoRoot, 'packages', packageName, 'dist')

  if (!existsSync(distDir)) {
    console.warn(`[dev] skip watch — missing ${distDir} (waiting for transpile)`)
    return
  }

  watch(distDir, { recursive: true }, (_event, filename) => {
    if (!filename || !/\.m?js$/.test(filename)) {
      return
    }

    scheduleDepRestart(packageName)
  })

  console.log(`[dev] watching packages/${packageName}/dist`)
}

const shutdown = signal => {
  clearTimeout(depRestartTimer)
  clearTimeout(rebuildTimer)
  nodeProcess?.kill(signal)
  process.exit(0)
}

console.log('[dev] watching apps/service/src…')

for (const packageName of repoPackageNames()) {
  watchRepoPackageDist(packageName)
}

if (!existsSync(join(serviceRoot, 'dist/index.js'))) {
  execSync(`rm -rf dist`, { cwd: serviceRoot, stdio: 'inherit' })
}

watch(srcDir, { recursive: true }, (_event, filename) => {
  if (!filename || !/\.tsx?$/.test(filename)) {
    return
  }

  rebuildService()
})

rebuildService({ immediate: true })

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
