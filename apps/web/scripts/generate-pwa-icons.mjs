#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = join(root, 'public', 'pwa')
const manifestPath = join(root, 'src', 'generated', 'pwa-icons.json')

const outputs = [
  { name: 'favicon', size: 32 },
  { name: 'apple-touch-icon', size: 180 },
  { name: 'pwa', size: 192 },
  { name: 'pwa', size: 512 },
]

function printUsage() {
  console.log(`Usage: yarn icons:generate <source-image> [crop-percent]

Arguments:
  source-image   Path to the source icon (png, jpg, webp, ...)
  crop-percent   Optional center crop size in percent (1-100, default: 100)
                 Example: 90 on a 1000x1000 image uses the center 900x900 area.

Examples:
  yarn icons:generate ikonka.PNG
  yarn icons:generate ikonka.PNG 90
  yarn icons:generate ./assets/icon.png 85`)
}

function parseArgs(argv) {
  const args = argv.filter(arg => arg !== '--')

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printUsage()
    process.exit(args.length === 0 ? 1 : 0)
  }

  const sourceArg = args[0]
  const cropArg = args[1]

  if (!sourceArg) {
    throw new Error('Missing source image path.')
  }

  const cropPercent = cropArg === undefined ? 100 : Number(cropArg)

  if (!Number.isFinite(cropPercent) || cropPercent <= 0 || cropPercent > 100) {
    throw new Error('Crop percent must be a number between 1 and 100.')
  }

  const sourcePath = isAbsolute(sourceArg) ? sourceArg : resolve(root, sourceArg)

  return { sourcePath, cropPercent }
}

function computeHash(sourceBuffer, cropPercent) {
  return createHash('sha256').update(sourceBuffer).update(String(cropPercent)).digest('hex').slice(0, 8)
}

async function cropCenterSquare(sourcePath, cropPercent) {
  const image = sharp(sourcePath)
  const { width = 0, height = 0 } = await image.metadata()

  if (width === 0 || height === 0) {
    throw new Error('Could not read source image dimensions.')
  }

  const baseSide = Math.min(width, height)
  const cropSide = Math.max(1, Math.round(baseSide * (cropPercent / 100)))
  const left = Math.floor((width - cropSide) / 2)
  const top = Math.floor((height - cropSide) / 2)

  const cropped = await image.extract({ left, top, width: cropSide, height: cropSide }).png().toBuffer()

  return {
    cropped,
    sourceWidth: width,
    sourceHeight: height,
    cropSide,
  }
}

async function removePreviousIcons() {
  await mkdir(outputDir, { recursive: true })

  const entries = await readdir(outputDir)
  await Promise.all(
    entries
      .filter(name => /\.(png)$/i.test(name))
      .map(name => rm(join(outputDir, name), { force: true })),
  )
}

async function generateIcons(cropped, hash) {
  const generated = []

  for (const { name, size } of outputs) {
    const filename = `${name}-${size}-${hash}.png`
    const filePath = join(outputDir, filename)
    const publicPath = `/pwa/${filename}`

    await sharp(cropped).resize(size, size, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(filePath)

    generated.push({ name, size, filename, filePath, publicPath })
  }

  return generated
}

async function writeManifest({ hash, cropPercent, sourcePath, cropSide, sourceWidth, sourceHeight, generated }) {
  const favicon = generated.find(icon => icon.size === 32)
  const appleTouchIcon = generated.find(icon => icon.size === 180)
  const pwa192 = generated.find(icon => icon.size === 192)
  const pwa512 = generated.find(icon => icon.size === 512)

  if (!favicon || !appleTouchIcon || !pwa192 || !pwa512) {
    throw new Error('Failed to generate all required icon sizes.')
  }

  const manifest = {
    hash,
    cropPercent,
    source: relative(root, sourcePath),
    cropSide,
    sourceWidth,
    sourceHeight,
    favicon: favicon.publicPath,
    appleTouchIcon: appleTouchIcon.publicPath,
    includeAssets: generated.map(icon => `pwa/${icon.filename}`),
    manifestIcons: [
      {
        src: `pwa/${pwa192.filename}`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `pwa/${pwa512.filename}`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `pwa/${pwa512.filename}`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }

  await mkdir(dirname(manifestPath), { recursive: true })
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  return manifest
}

async function main() {
  const { sourcePath, cropPercent } = parseArgs(process.argv.slice(2))
  const sourceBuffer = await readFile(sourcePath)
  const hash = computeHash(sourceBuffer, cropPercent)
  const { cropped, cropSide, sourceWidth, sourceHeight } = await cropCenterSquare(sourcePath, cropPercent)

  await removePreviousIcons()
  const generated = await generateIcons(cropped, hash)
  const manifest = await writeManifest({
    hash,
    cropPercent,
    sourcePath,
    cropSide,
    sourceWidth,
    sourceHeight,
    generated,
  })

  console.log(`Generated PWA icons (${hash}) from ${manifest.source}`)
  console.log(`Source: ${sourceWidth}x${sourceHeight}, center crop: ${cropSide}x${cropSide} (${cropPercent}%)`)
  for (const icon of generated) {
    console.log(`- ${icon.publicPath}`)
  }
  console.log(`Manifest: ${relative(root, manifestPath)}`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
