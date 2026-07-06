#!/usr/bin/env node
/**
 * Start mysql-mcp-server after verifying DB credentials the same way as apps/service.
 */

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const envFile = path.join(root, 'apps/service/.env')
const configFile = path.join(__dirname, 'mysql-mcp.generated.yaml')
const mariadbModule = path.join(root, 'node_modules/mariadb/promise.js')

function loadEnv(filePath) {
  const env = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

function pick(env, key, fallback) {
  return env[key] || env[fallback] || ''
}

function buildDsn(env) {
  const host = pick(env, 'DB_MCP_HOST', 'DB_HOST')
  const port = pick(env, 'DB_MCP_PORT', '') || '3306'
  const user = pick(env, 'DB_MCP_USER', 'DB_USER')
  const password = pick(env, 'DB_MCP_PASSWORD', 'DB_PASSWORD')
  const schema = env.DB_SCHEMA

  if (!host || !user || !password || !schema) {
    process.stderr.write(
      'Missing DB_HOST, DB_USER, DB_PASSWORD, or DB_SCHEMA in apps/service/.env\n',
    )
    process.exit(1)
  }

  // go-sql-driver splits user:password on the first colon before @, so passwords
  // with : / * etc. can stay raw; URL-encoding was sending the wrong secret to Go.
  return `${user}:${password}@tcp(${host}:${port})/${schema}?parseTime=true`
}

async function verifyWithServiceDriver(env) {
  const mariadb = await import(pathToFileURL(mariadbModule).href)
  const conn = await mariadb.createConnection({
    host: pick(env, 'DB_MCP_HOST', 'DB_HOST'),
    port: Number(pick(env, 'DB_MCP_PORT', '') || 3306),
    user: pick(env, 'DB_MCP_USER', 'DB_USER'),
    password: pick(env, 'DB_MCP_PASSWORD', 'DB_PASSWORD'),
    database: env.DB_SCHEMA,
    connectTimeout: 5000,
  })
  await conn.query('SELECT 1')
  await conn.end()
}

function writeMcpConfig() {
  // Query/feature limits only — DSN goes via MYSQL_DSN env (same password as preflight).
  fs.writeFileSync(
    configFile,
    `query:
  max_rows: 200
  timeout_seconds: 30
features:
  extended_tools: true
`,
  )
}

async function main() {
  const env = loadEnv(envFile)
  try {
    await verifyWithServiceDriver(env)
  } catch (error) {
    process.stderr.write(
      `MCP DB preflight failed (same credentials as service): ${error.message}\n`,
    )
    process.exit(1)
  }

  writeMcpConfig()

  const child = spawn('mysql-mcp-server', ['--config', configFile], {
    stdio: 'inherit',
    env: {
      ...process.env,
      MYSQL_MCP_EXTENDED: '1',
      MYSQL_DSN: buildDsn(env),
    },
  })

  child.on('exit', code => process.exit(code ?? 1))
}

main().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`)
  process.exit(1)
})
