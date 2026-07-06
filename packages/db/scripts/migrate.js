#!/usr/bin/env node
'use strict'

const fs = require('fs/promises')
const path = require('path')
const mariadb = require('mariadb')

const PACKAGE_DIR = path.join(__dirname, '..')
const MIGRATIONS_DIR = path.join(PACKAGE_DIR, 'migrations')
const SQLS_DIR = path.join(MIGRATIONS_DIR, 'sqls')

const MIGRATION_TABLE = `
CREATE TABLE IF NOT EXISTS migrations (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  run_on datetime NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
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
  user: requireEnv('DB_MIGRATE_USER'),
  password: requireEnv('DB_MIGRATE_PASSWORD'),
  database: requireEnv('DB_MIGRATE_SCHEMA'),
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

async function connect() {
  return mariadb.createConnection({ ...getMigrateConfig(), multipleStatements: true })
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

async function getAppliedNames(conn) {
  const rows = await conn.query('SELECT name FROM migrations ORDER BY id')
  return rows.map(row => row.name)
}

async function cmdStatus() {
  const all = await listMigrations()
  const conn = await connect()

  try {
    await conn.query(MIGRATION_TABLE)
    const applied = new Set(await getAppliedNames(conn))
    const pending = all.filter(base => !applied.has(migrationRecordName(base)))

    if (pending.length === 0) {
      console.log('[INFO] No pending migrations')
    } else {
      console.log('[INFO] Pending migrations:', pending.map(base => migrationRecordName(base)))
    }

    if (applied.size > 0) {
      console.log('[INFO] Applied migrations:', [...applied])
    }
  } finally {
    await conn.end()
  }
}

async function cmdUp() {
  const all = await listMigrations()
  const conn = await connect()

  try {
    await conn.query(MIGRATION_TABLE)
    const applied = new Set(await getAppliedNames(conn))
    const pending = all.filter(base => !applied.has(migrationRecordName(base)))

    if (pending.length === 0) {
      console.log('[INFO] No migrations to run')
      return
    }

    for (const base of pending) {
      const sql = await readSql(base, 'up')
      const name = migrationRecordName(base)

      await conn.beginTransaction()
      try {
        await conn.query(sql)
        await conn.query('INSERT INTO migrations (name, run_on) VALUES (?, NOW())', [name])
        await conn.commit()
        console.log(`[INFO] Processed migration ${base}`)
      } catch (err) {
        await conn.rollback()
        throw err
      }
    }

    console.log('[INFO] Done')
  } finally {
    await conn.end()
  }
}

async function cmdDown() {
  const conn = await connect()

  try {
    await conn.query(MIGRATION_TABLE)
    const applied = await getAppliedNames(conn)

    if (applied.length === 0) {
      console.log('[INFO] No migrations to rollback')
      return
    }

    const lastName = applied[applied.length - 1]
    const base = lastName.startsWith('/') ? lastName.slice(1) : lastName
    const sql = await readSql(base, 'down')

    await conn.beginTransaction()
    try {
      await conn.query(sql)
      await conn.query('DELETE FROM migrations WHERE name = ?', [lastName])
      await conn.commit()
      console.log(`[INFO] Rolled back migration ${base}`)
    } catch (err) {
      await conn.rollback()
      throw err
    }

    console.log('[INFO] Done')
  } finally {
    await conn.end()
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

  console.log(`[INFO] Created migration ${base}`)
  console.log(`  ${path.relative(PACKAGE_DIR, upPath)}`)
  console.log(`  ${path.relative(PACKAGE_DIR, downPath)}`)
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
  console.error('[ERROR]', err.message || err)
  process.exit(1)
})
