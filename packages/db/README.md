# @repo/db

MariaDB for the `apollo` database: SQL migrations and a shared runtime connection pool.

Used by `apps/service` (reads + weather writes) and `@repo/cron-scripts` (KNX logging).

Migration tooling is a small Node script on `mariadb` only — no `db-migrate`, no native `ssh2`/`cpu-features` (works on
Raspberry Pi).

## Runtime API

Callers must load env before first DB access (e.g. `apps/service/src/config.ts` loads `apps/service/.env`).

```ts
import { getDbPool, closeDbPool } from '@repo/db'

const conn = await getDbPool().getConnection()
try {
  await conn.query('select 1')
} finally {
  await conn.release()
}

await closeDbPool() // on process shutdown
```

Pool config reads `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA` from `process.env` (set in `apps/service/.env`).

## Setup (migrations)

Migrations use **separate** variables in `packages/db/.env`:

- `DB_MIGRATE_HOST`, `DB_MIGRATE_USER`, `DB_MIGRATE_PASSWORD`, `DB_MIGRATE_SCHEMA`

```sh
cp packages/db/.env.example packages/db/.env
# fill DB_MIGRATE_*
```

Credentials are independent from [`apps/service/.env`](../apps/service/.env). Copy the same values initially, or use a
DDL-capable user for migrations and a narrower user for the runtime pool.

Create the database once (as admin), then apply migrations:

```sql
CREATE DATABASE apollo
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
```

```sh
yarn workspace @repo/db db:migrate
```

## Scripts

| Script             | Description                                       |
| ------------------ | ------------------------------------------------- |
| `build`            | Compile runtime to `dist/`                        |
| `dev`              | `tsc --watch`                                     |
| `db:migrate`       | Apply pending migrations                          |
| `db:rollback`      | Revert last migration (**destructive** on `down`) |
| `db:status`        | Check migration state                             |
| `db:create <name>` | Scaffold new SQL migration files                  |

From repo root, shorthand:

```sh
yarn db:migrate
```

## New migration

```sh
yarn workspace @repo/db db:create add-meter-total
```

Edit `migrations/sqls/<timestamp>-add-meter-total-up.sql` and `-down.sql`, then `db:migrate`.

## Existing production database

The initial migration uses `CREATE TABLE IF NOT EXISTS`. First `db:migrate` on a DB that already has tables is safe —
applied versions are recorded in the `migrations` table (compatible with prior db-migrate runs).

## Layout

```
scripts/migrate.js   # migration CLI (up / down / status / create)
src/                 # runtime (getDbPool, closeDbPool)
migrations/
  <timestamp>-<name>.js      # optional marker file
  sqls/
    <timestamp>-<name>-up.sql
    <timestamp>-<name>-down.sql
```
