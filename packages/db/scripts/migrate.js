#!/usr/bin/env node
'use strict'

const fs = require('fs/promises')
const path = require('path')
const postgres = require('postgres')
const { createLogger } = require('@repo/logger')

const logger = createLogger({ name: 'db-migrate' })

const PACKAGE_DIR = path.join(__dirname, '..')
const MIGRATIONS_DIR = path.join(PACKAGE_DIR, 'migrations')
const SQLS_DIR = path.join(MIGRATIONS_DIR, 'sqls')

const MIGRATION_TABLE = `
CREATE TABLE IF NOT EXISTS migrations (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  run_on timestamptz NOT NULL
)
`

const requireEnv = name => {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const getMigrateConfig = () => ({
  host: requireEnv('DB_MIGRATE_HOST'),
  port: Number(process.env.DB_MIGRATE_PORT ?? 5432),
  database: requireEnv('DB_MIGRATE_SCHEMA'),
  username: requireEnv('DB_MIGRATE_USER'),
  password: requireEnv('DB_MIGRATE_PASSWORD'),
})

const migrationRecordName = base => `/${base}`

const formatTimestamp = date => {
  const pad = n => String(n).padStart(2, '0')
  return (
    String(date.getFullYear()) +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  )
}

function connect() {
  return postgres({
    ...getMigrateConfig(),
    max: 1,
    prepare: false,
  })
}

async function listMigrations() {
  const files = await fs.readdir(SQLS_DIR)
  return files
    .filter(file => file.endsWith('-up.sql'))
    .map(file => file.slice(0, -'-up.sql'.length))
    .sort()
}

async function readSql(base, direction) {
  const filePath = path.join(SQLS_DIR, `${base}-${direction}.sql`)
  return fs.readFile(filePath, 'utf8')
}

async function getAppliedNames(sql) {
  const rows = await sql`select name from migrations order by id`
  return rows.map(row => row.name)
}

async function cmdStatus() {
  const all = await listMigrations()
  const sql = connect()

  try {
    await sql.unsafe(MIGRATION_TABLE).simple()
    const applied = new Set(await getAppliedNames(sql))
    const pending = all.filter(base => !applied.has(migrationRecordName(base)))

    if (pending.length === 0) {
      logger.info('No pending migrations')
    } else {
      logger.info({ pending: pending.map(base => migrationRecordName(base)) }, 'Pending migrations')
    }

    if (applied.size > 0) {
      logger.info({ applied: [...applied] }, 'Applied migrations')
    }
  } finally {
    await sql.end({ timeout: 5 })
  }
}

async function cmdUp() {
  const all = await listMigrations()
  const sql = connect()

  try {
    await sql.unsafe(MIGRATION_TABLE).simple()
    const applied = new Set(await getAppliedNames(sql))
    const pending = all.filter(base => !applied.has(migrationRecordName(base)))

    if (pending.length === 0) {
      logger.info('No migrations to run')
      return
    }

    for (const base of pending) {
      const migrationSql = await readSql(base, 'up')
      const name = migrationRecordName(base)

      await sql.begin(async tx => {
        await tx.unsafe(migrationSql).simple()
        await tx`insert into migrations (name, run_on) values (${name}, now())`
      })

      logger.info({ migration: base }, 'Processed migration')
    }

    logger.info({ action: 'up', count: pending.length }, 'Migrations complete')
  } finally {
    await sql.end({ timeout: 5 })
  }
}

async function cmdDown() {
  const sql = connect()

  try {
    await sql.unsafe(MIGRATION_TABLE).simple()
    const applied = await getAppliedNames(sql)

    if (applied.length === 0) {
      logger.info('No migrations to rollback')
      return
    }

    const lastName = applied[applied.length - 1]
    const base = lastName.startsWith('/') ? lastName.slice(1) : lastName
    const migrationSql = await readSql(base, 'down')

    await sql.begin(async tx => {
      await tx.unsafe(migrationSql).simple()
      await tx`delete from migrations where name = ${lastName}`
    })

    logger.info({ migration: base }, 'Rolled back migration')
    logger.info({ action: 'down', count: 1 }, 'Migration rollback complete')
  } finally {
    await sql.end({ timeout: 5 })
  }
}

async function cmdCreate(name) {
  if (!name || name.startsWith('-')) {
    throw new Error('Usage: db:create <name>')
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Error('Migration name must be lowercase letters, numbers, and hyphens only')
  }

  const base = `${formatTimestamp(new Date())}-${name}`
  const jsPath = path.join(MIGRATIONS_DIR, `${base}.js`)
  const upPath = path.join(SQLS_DIR, `${base}-up.sql`)
  const downPath = path.join(SQLS_DIR, `${base}-down.sql`)

  for (const filePath of [jsPath, upPath, downPath]) {
    try {
      await fs.access(filePath)
      throw new Error(`Migration file already exists: ${filePath}`)
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }
  }

  const jsStub = `'use strict'

// SQL migration — edit sqls/${base}-up.sql and sqls/${base}-down.sql
exports._meta = { version: 1 }
`

  await fs.writeFile(jsPath, jsStub)
  await fs.writeFile(upPath, `-- ${base} up\n`)
  await fs.writeFile(downPath, `-- ${base} down\n`)

  logger.info(
    {
      migration: base,
      upPath: path.relative(PACKAGE_DIR, upPath),
      downPath: path.relative(PACKAGE_DIR, downPath),
    },
    'Created migration',
  )
}

async function main() {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case 'up':
    case 'migrate':
      await cmdUp()
      break
    case 'down':
    case 'rollback':
      await cmdDown()
      break
    case 'status':
    case 'check':
      await cmdStatus()
      break
    case 'create':
      await cmdCreate(args[0])
      break
    default:
      throw new Error('Usage: migrate.js <up|down|status|create> [name]')
  }
}

main().catch(err => {
  logger.error({ err }, 'Migration failed')
  process.exit(1)
})
