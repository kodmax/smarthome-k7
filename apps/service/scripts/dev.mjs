import { execSync, spawn } from 'node:child_process'
import { existsSync, readFileSync, watch } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const serviceRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = join(serviceRoot, '../..')
const srcDir = join(serviceRoot, 'src')
const DEP_RESTART_DEBOUNCE_MS = 300
const REBUILD_DEBOUNCE_MS = 150
const SHUTDOWN_WAIT_MS = 30_000

let nodeProcess
let hasStarted = false
let devShuttingDown = false
let depRestartTimer
let rebuildTimer
let rebuildPending = false
let startNodeChain = Promise.resolve()
const expectedChildExits = new WeakSet()

const isChildRunning = childProcess =>
  childProcess !== undefined &&
  childProcess.exitCode === null &&
  childProcess.signalCode === null

const repoPackageNames = () => {
  const pkgJson = JSON.parse(readFileSync(join(serviceRoot, 'package.json'), 'utf8'))
  return Object.keys(pkgJson.dependencies ?? {}).flatMap(name => {
    if (!name.startsWith('@repo/')) {
      return []
    }

    return [name.slice('@repo/'.length)]
  })
}

const compileService = () => {
  try {
    // SWC transpile only (yarn transpile) — not tsc, so dev keeps running on TS type errors.
    execSync('yarn transpile', { cwd: serviceRoot, stdio: 'inherit' })
    return true
  } catch {
    console.error('[dev] compile failed — fix errors above; watcher still running')
    return false
  }
}

const waitForExit = (childProcess, timeoutMs) =>
  new Promise(resolve => {
    if (!isChildRunning(childProcess)) {
      resolve()
      return
    }

    let settled = false
    let timer
    const finish = () => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      childProcess.off('exit', onExit)
      childProcess.off('error', onError)
      resolve()
    }
    const onExit = () => finish()
    const onError = () => finish()

    childProcess.once('exit', onExit)
    childProcess.once('error', onError)

    if (!isChildRunning(childProcess)) {
      finish()
      return
    }

    timer = setTimeout(() => {
      console.warn(`[dev] service did not exit within ${timeoutMs}ms — sending SIGKILL`)
      if (isChildRunning(childProcess)) {
        childProcess.kill('SIGKILL')
      } else {
        finish()
      }
    }, timeoutMs)
  })

const startNode = async () => {
  startNodeChain = startNodeChain.then(async () => {
    if (isChildRunning(nodeProcess)) {
      expectedChildExits.add(nodeProcess)
      nodeProcess.kill('SIGTERM')
      await waitForExit(nodeProcess, SHUTDOWN_WAIT_MS)
    }

    if (devShuttingDown) {
      return
    }

    const childProcess = spawn('node', ['-r', './dist/preload.js', './dist/index.js'], {
      cwd: serviceRoot,
      stdio: 'inherit',
    })
    nodeProcess = childProcess

    childProcess.once('exit', code => {
      if (
        code !== 0 ||
        devShuttingDown ||
        expectedChildExits.has(childProcess) ||
        nodeProcess !== childProcess
      ) {
        return
      }

      setImmediate(() => process.exit(0))
    })
  })

  await startNodeChain
}

const rebuildService = ({ immediate = false } = {}) => {
  if (rebuildPending || devShuttingDown) {
    return
  }

  clearTimeout(rebuildTimer)

  const run = async () => {
    rebuildPending = true

    try {
      if (!compileService()) {
        return
      }

      if (!hasStarted) {
        hasStarted = true
        await startNode()
        console.log('[dev] ready — watching apps/service/src and @repo/*/dist')
      } else {
        console.log('[dev] recompiled — restarting service…')
        await startNode()
      }
    } finally {
      rebuildPending = false
    }
  }

  if (immediate) {
    void run()
    return
  }

  rebuildTimer = setTimeout(() => {
    void run()
  }, REBUILD_DEBOUNCE_MS)
}

const scheduleDepRestart = packageName => {
  if (!hasStarted || devShuttingDown || rebuildPending) {
    return
  }

  clearTimeout(depRestartTimer)
  depRestartTimer = setTimeout(() => {
    console.log(`[dev] @repo/${packageName} dist changed — restarting service…`)
    void startNode()
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

const shutdown = async signal => {
  if (devShuttingDown) {
    return
  }
  devShuttingDown = true

  clearTimeout(depRestartTimer)
  clearTimeout(rebuildTimer)

  if (isChildRunning(nodeProcess)) {
    nodeProcess.kill(signal)
    await waitForExit(nodeProcess, SHUTDOWN_WAIT_MS)
  }

  process.exit(0)
}

console.log('[dev] watching apps/service/src…')

for (const packageName of repoPackageNames()) {
  watchRepoPackageDist(packageName)
}

watch(srcDir, { recursive: true }, (_event, filename) => {
  if (!filename || !/\.tsx?$/.test(filename)) {
    return
  }

  rebuildService()
})

rebuildService({ immediate: true })

process.on('SIGINT', () => {
  void shutdown('SIGINT')
})
process.on('SIGTERM', () => {
  void shutdown('SIGTERM')
})
