# service

Dashboard backend — aggregates data from KNX, web scrapers, and MariaDB, and publishes it as WebSocket feeds.

## Stack

- Node.js (CommonJS), TypeScript
- Bun (bundling)
- `@repo/apollo-ws`, `js-knx`, `@repo/db`, `@repo/transmission`, Vitest

## Running

```sh
cp .env.example .env   # fill in values

yarn dev                          # from repo root — everything with a dev script
yarn workspace service dev:local  # backend + library watchers, without web
yarn workspace service start      # production (after build)
```

The WebSocket server listens on port **3678**.

## Environment variables

Copy `.env.example` and fill in:

| Variable                                                             | Description                                      |
| -------------------------------------------------------------------- | ------------------------------------------------ |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA`                     | MariaDB runtime pool (`@repo/db`)                |
| `KNX_HOST`                                                           | KNX gateway address (required unless `NO_KNX=1`) |
| `NO_KNX`                                                             | `1` — disables KNX feeds and cron jobs           |
| `NO_CRON`                                                            | `1` — disables KNX cron jobs (requires KNX)      |
| `CACHE_DIR`                                                          | Feed cache directory (default `.cache`)          |
| `LOCATION_LAT`, `LOCATION_LONG`                                      | Coordinates (weather, suncalc)                   |
| `GOOGLE_SOCS_COOKIE`                                                 | Cookie for Google weather scraping               |
| `NFJ_COOKIE`, `THEPROTOCOL_COOKIE`                                   | Cookies for job board scraping                   |
| `TRANSMISSION_URL`, `TRANSMISSION_USERNAME`, `TRANSMISSION_PASSWORD` | Transmission RPC (`@repo/transmission`)          |

## Feeds

**Web (scraping):** `weather`, `stock-market`, `news`, `jobs`, `top-torrents`, `transmission`

**KNX:** energy, heating, CO₂, humidity, room temperatures

KNX cron jobs (energy logging, clock sync, indoor readings) run in-process via `@repo/cron-scripts` →
`initKnxCronJobs()`. Disabled with `NO_CRON=1` or `NO_KNX=1`.

## Scripts

| Script                     | Description                     |
| -------------------------- | ------------------------------- |
| `dev`                      | Bundle + watch + `node --watch` |
| `build`                    | `tsc` + Bun bundle              |
| `bundle`                   | `bun build` → `dist/`           |
| `start`                    | `node dist/index.js`            |
| `test` / `lint` / `format` | Vitest / ESLint / Prettier      |

## Monorepo dependencies

| Package              | Role                                   |
| -------------------- | -------------------------------------- |
| `@repo/apollo-ws`    | WebSocket server, cache, feed registry |
| `@repo/cron-scripts` | KNX scheduled jobs (in-process)        |
| `@repo/db`           | Shared MariaDB pool + migrations       |
| `@repo/transmission` | Transmission BitTorrent RPC client     |
| `@repo/knx-schema`   | KNX group address map                  |
| `@repo/types`        | Feed payload type contracts            |

Entry point: `src/index.ts`.

## Database migrations

Schema DDL and migration tooling live in [`packages/db`](packages/db) (`@repo/db`). Runtime pool uses `DB_*` in this
`.env`; migrations use `DB_MIGRATE_*` in `packages/db/.env`. Copy `packages/db/.env.example` → `.env` — credentials are
independent from service (you can use a DDL user for migrations).

```sh
yarn workspace @repo/db db:migrate
```

See [`packages/db/README.md`](../packages/db/README.md).

## MCP / agent access to MariaDB

Cursor can query the database via [mysql-mcp-server](https://github.com/askdba/mysql-mcp-server) (read-only by default).

```sh
brew install askdba/tap/mysql-mcp-server
```

Konfiguracja MCP jest w [`.cursor/mcp.json`](../../.cursor/mcp.json) (w repo, ścieżki przez `${workspaceFolder}`).

The launcher [`.cursor/mcp-mariadb.mjs`](../.cursor/mcp-mariadb.mjs) verifies credentials with the same `mariadb` driver
as service, then starts `mysql-mcp-server` from a generated YAML config (avoids passing `%`-encoded DSN via env).
Credentials are read from `apps/service/.env` by [`.cursor/mcp-dsn.py`](../.cursor/mcp-dsn.py). Optional `DB_MCP_*`
overrides apply. Enable the server in **Cursor Settings → MCP** and restart Cursor.

### Cursor sandbox

`.cursor/sandbox.json` jest w `.gitignore` — każdy dev konfiguruje sandbox u siebie (np. dostęp do LAN `192.168.1.0/24`
dla MCP do bazy).

### Troubleshooting: `no route to host`

If `ping 192.168.1.2` works in Terminal but MCP logs `connect: no route to host`, Cursor likely blocks private LAN IPs
in its sandbox (RFC 1918). Dodaj swoją podsieć LAN do `networkPolicy.allow` w lokalnym `.cursor/sandbox.json` —
**restart Cursor** after changing it, then toggle MCP off/on.

Also check **System Settings → Privacy & Security → Local Network** — Cursor must be allowed (toggle off/on if needed).

MCP connects from the Mac to `DB_HOST` (or `DB_MCP_HOST`). Error `dial tcp …: no route to host` with working Terminal
ping usually means Cursor sandbox or Local Network permission, not MariaDB config.

**Away from home:** SSH tunnel + `DB_MCP_HOST=127.0.0.1` (add `127.0.0.0/8` to sandbox allow if needed).
