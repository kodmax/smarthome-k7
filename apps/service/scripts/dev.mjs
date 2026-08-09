import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, watch } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serviceRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(serviceRoot, '../..')
const tscBin = join(serviceRoot, 'node_modules/.bin/tsc')
const tscAliasBin = join(serviceRoot, 'node_modules/.bin/tsc-alias')
const TSC_READY = 'Found 0 errors. Watching for file changes.'
const DEP_RESTART_DEBOUNCE_MS = 300

let nodeProcess
let tscProcess
let tscOutput = ''
let hasStarted = false
let depRestartTimer

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
  execSync(`"${tscAliasBin}" -p tsconfig.json`, { cwd: serviceRoot, stdio: 'inherit' })
}

const startNode = () => {
  nodeProcess?.kill('SIGTERM')

  nodeProcess = spawn('node', ['-r', './dist/otel-instrumentation.js', './dist/index.js'], {
    cwd: serviceRoot,
    stdio: 'inherit',
  })
}

const onTscReady = () => {
  runTscAlias()

  if (!hasStarted) {
    hasStarted = true
    startNode()
    console.log('[dev] ready — watching apps/service/src and @repo/*/dist')
    return
  }

  console.log('[dev] recompiled — restarting service…')
  startNode()
}

const scheduleDepRestart = (packageName) => {
  if (!hasStarted) {
    return
  }

  clearTimeout(depRestartTimer)
  depRestartTimer = setTimeout(() => {
    console.log(`[dev] @repo/${packageName} dist changed — restarting service…`)
    startNode()
  }, DEP_RESTART_DEBOUNCE_MS)
}

const watchRepoPackageDist = (packageName) => {
  const distDir = join(repoRoot, 'packages', packageName, 'dist')

  if (!existsSync(distDir)) {
    console.warn(`[dev] skip watch — missing ${distDir} (run build first)`)
    return
  }

  watch(distDir, { recursive: true }, () => {
    scheduleDepRestart(packageName)
  })

  console.log(`[dev] watching packages/${packageName}/dist`)
}

const shutdown = (signal) => {
  clearTimeout(depRestartTimer)
  nodeProcess?.kill(signal)
  tscProcess?.kill(signal)
  process.exit(0)
}

console.log('[dev] starting tsc --watch…')

for (const packageName of repoPackageNames()) {
  watchRepoPackageDist(packageName)
}

tscProcess = spawn(tscBin, ['-w', '--preserveWatchOutput'], {
  cwd: serviceRoot,
  stdio: ['inherit', 'pipe', 'inherit'],
})

tscProcess.stdout.on('data', (chunk) => {
  const text = chunk.toString()
  process.stdout.write(text)
  tscOutput += text

  if (!tscOutput.includes(TSC_READY)) {
    return
  }

  tscOutput = ''
  onTscReady()
})

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
