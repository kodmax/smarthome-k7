# @repo/db

MariaDB schema migrations for the `apollo` database (`db-migrate`, plain SQL).

Used by `apps/service` (reads + weather writes) and `@repo/cron-scripts` (KNX logging). Runtime code does not import this package — only migration tooling lives here.

## Setup

```sh
cp packages/db/.env.example packages/db/.env
# fill DB_HOST, DB_USER, DB_PASSWORD, DB_SCHEMA
```

Credentials are **separate** from [`apps/service/.env`](../apps/service/.env). Copy the same values initially, or use a DDL-capable user for migrations and a narrower user for runtime.

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

| Script | Description |
|--------|-------------|
| `db:migrate` | Apply pending migrations |
| `db:rollback` | Revert last migration (**destructive** on `down`) |
| `db:status` | Check migration state |
| `db:create <name> -- --sql-file` | Scaffold a new SQL migration |

From repo root, shorthand:

```sh
yarn db:migrate
```

## New migration

```sh
yarn workspace @repo/db db:create add-meter-total -- --sql-file
```

Edit `migrations/sqls/<timestamp>-add-meter-total-up.sql` and `-down.sql`, then `db:migrate`.

## Existing production database

The initial migration uses `CREATE TABLE IF NOT EXISTS`. First `db:migrate` on a DB that already has tables is safe — db-migrate records the version in the `migrations` table.

## Layout

```
database.json
migrations/
  <timestamp>-<name>.js      # thin wrapper → runSqlFile
  sqls/
    <timestamp>-<name>-up.sql
    <timestamp>-<name>-down.sql
```
