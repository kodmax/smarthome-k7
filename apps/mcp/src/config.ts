import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ClientOptions } from 'ws'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(packageRoot, '.env')

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const index = trimmed.indexOf('=')
    if (index === -1) continue

    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1)
    }

    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

loadEnvFile(envPath)

export const apolloWsUrl = process.env.APOLLO_WS_URL ?? 'ws://127.0.0.1:3678'

export const apolloWsOptions: ClientOptions = {}

const caFile = process.env.APOLLO_WS_CA_FILE?.trim()
if (caFile) {
  const resolved = path.isAbsolute(caFile) ? caFile : path.join(packageRoot, caFile)
  apolloWsOptions.ca = fs.readFileSync(resolved)
}
