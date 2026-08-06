# @repo/db

PostgreSQL for the smarthome database: SQL migrations and a shared runtime connection pool.

Used by `apps/service` and `@repo/cron-scripts`.

Migration tooling is a small Node script on `postgres.js` — no `db-migrate`, no native addons (works on Raspberry Pi).

## Runtime API

Callers must load env before first DB access (e.g. `apps/service/src/config.ts` loads `apps/service/.env`).

```ts
import { getSql, closeSql, type Sql } from '@repo/db'

const db = getSql()
await db`select 1`

await closeSql() // on process shutdown
```

Pool config reads `DB_HOST`, `DB_PORT` (default `5432`), `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA` from `process.env`.

## Setup (migrations)

Migrations use **separate** variables in `packages/db/.env`:

- `DB_MIGRATE_HOST`, `DB_MIGRATE_PORT`, `DB_MIGRATE_USER`, `DB_MIGRATE_PASSWORD`, `DB_MIGRATE_SCHEMA`

```sh
cp packages/db/.env.example packages/db/.env
# fill DB_MIGRATE_*
```

Credentials are independent from [`apps/service/.env`](../apps/service/.env). Copy the same values initially, or use a
DDL-capable user for migrations and a narrower user for the runtime pool.

Create the database once (as admin), then apply migrations:

```sql
CREATE USER smarthome_k7 WITH PASSWORD '...';
CREATE DATABASE smarthome_k7 OWNER smarthome_k7;
```

```sh
yarn workspace @repo/db db:migrate
```

## Scripts

| Script             | Description                             |
| ------------------ | --------------------------------------- |
| `build`            | Compile runtime to `dist/`              |
| `dev`              | `tsc --watch`                           |
| `db:migrate`       | Apply pending migrations                |
| `db:rollback`      | Revert last migration (**destructive**) |
| `db:status`        | Check migration state                   |
| `db:create <name>` | Scaffold new SQL migration files        |

From repo root:

```sh
yarn db:migrate
```

## New migration

```sh
yarn workspace @repo/db db:create add-meter-total
```

Edit `migrations/sqls/<timestamp>-add-meter-total-up.sql` and `-down.sql`, then `db:migrate`.

## Layout

```
scripts/migrate.js   # migration CLI (up / down / status / create)
src/                 # runtime (getSql, closeSql)
migrations/
  <timestamp>-<name>.js
  sqls/
    <timestamp>-<name>-up.sql
    <timestamp>-<name>-down.sql
```
