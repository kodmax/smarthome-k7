import { createRequire } from 'node:module'
import { readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(scriptDir, '..')
const require = createRequire(join(repoRoot, 'package.json'))
const esbuild = require('esbuild')

const watchMode = process.argv.includes('--watch')
const cwd = process.cwd()

const stripJsonComments = (raw) =>
  raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')

const readJson = (path) => JSON.parse(stripJsonComments(readFileSync(path, 'utf8')))

const isTestOrSpecFile = (filePath) => /\.(test|spec)\.[cm]?tsx?$/.test(filePath)

const loadTsConfig = () => {
  const tsconfigPath = join(cwd, 'tsconfig.json')
  const local = readJson(tsconfigPath)
  const rootDir = local.compilerOptions?.rootDir ?? 'src'
  const outDir = local.compilerOptions?.outDir ?? 'dist'
  const include = local.include ?? [`${rootDir}/**/*.ts`]
  const exclude = local.exclude ?? []

  return {
    rootDir: resolve(cwd, rootDir),
    outDir: resolve(cwd, outDir),
    include,
    exclude: [...exclude, '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
  }
}

const matchesPattern = (filePath, pattern) => {
  const normalized = filePath.replaceAll('\\', '/')
  const regex = new RegExp(
    `^${pattern
      .replaceAll('\\', '/')
      .replaceAll('**', '§§')
      .replaceAll('*', '[^/]*')
      .replaceAll('§§', '.*')
      .replaceAll('.', '\\.')}$`,
  )
  return regex.test(normalized)
}

const isExcluded = (relativePath, exclude) =>
  exclude.some(pattern => matchesPattern(relativePath, pattern.replaceAll('\\', '/')))

const walkTsFiles = (dir, files = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') {
      continue
    }

    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkTsFiles(fullPath, files)
      continue
    }

    if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      if (isTestOrSpecFile(entry.name)) {
        continue
      }
      files.push(fullPath)
    }
  }

  return files
}

const collectEntryPoints = ({ rootDir, include, exclude }) => {
  const entryPoints = new Set()

  for (const pattern of include) {
    const baseDir = pattern.includes('*')
      ? resolve(cwd, pattern.split('*')[0].replace(/\/$/, '') || '.')
      : resolve(cwd, pattern)

    if (!statSync(baseDir, { throwIfNoEntry: false })?.isDirectory()) {
      continue
    }

    for (const filePath of walkTsFiles(baseDir)) {
      const rel = relative(cwd, filePath).replaceAll('\\', '/')
      if (isExcluded(rel, exclude)) {
        continue
      }
      entryPoints.add(filePath)
    }
  }

  if (entryPoints.size === 0) {
    walkTsFiles(rootDir).forEach(filePath => {
      const rel = relative(cwd, filePath).replaceAll('\\', '/')
      if (!isExcluded(rel, exclude)) {
        entryPoints.add(filePath)
      }
    })
  }

  return [...entryPoints]
}

const resolveFormat = () => {
  const pkgPath = join(cwd, 'package.json')
  if (statSync(pkgPath, { throwIfNoEntry: false })) {
    const pkg = readJson(pkgPath)
    if (pkg.type === 'module') {
      return 'esm'
    }
  }

  return 'cjs'
}

const run = async () => {
  const config = loadTsConfig()
  const entryPoints = collectEntryPoints(config)

  if (entryPoints.length === 0) {
    console.error(`[transpile] no TypeScript entry points found in ${cwd}`)
    process.exit(1)
  }

  const buildOptions = {
    entryPoints,
    outdir: config.outDir,
    outbase: config.rootDir,
    platform: 'node',
    format: resolveFormat(),
    target: 'es2022',
    sourcemap: true,
    logLevel: 'info',
  }

  rmSync(config.outDir, { recursive: true, force: true })

  if (watchMode) {
    const context = await esbuild.context(buildOptions)
    await context.watch()
    console.log(`[transpile] watching ${entryPoints.length} files → ${relative(cwd, config.outDir)}`)
    return
  }

  await esbuild.build(buildOptions)
  console.log(`[transpile] compiled ${entryPoints.length} files → ${relative(cwd, config.outDir)}`)
}

run().catch(error => {
  console.error('[transpile]', error)
  process.exit(1)
})
