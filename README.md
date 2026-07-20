# smarthome-k7

Smart home dashboard monorepo: the backend aggregates data from KNX and web scrapers; the frontend displays it live over
WebSocket.

## Structure

| Directory                                                  | Description                                   |
| ---------------------------------------------------------- | --------------------------------------------- |
| [`apps/web`](apps/web)                                     | React dashboard (Vite, MUI)                   |
| [`apps/service`](apps/service)                             | Backend — feeds, cache, WebSocket             |
| [`apps/mcp`](apps/mcp)                                     | MCP server for Cursor (dashboard tools)       |
| [`packages/apollo-ws`](packages/apollo-ws)                 | WebSocket server and feed registry            |
| [`packages/apollo-card`](packages/apollo-card)             | Zoomable dashboard card shell                 |
| [`packages/feed-client`](packages/feed-client)             | React hooks for feed subscriptions            |
| [`packages/types`](packages/types)                         | Shared feed payload types                     |
| [`packages/knx-schema`](packages/knx-schema)               | KNX group address map                         |
| [`packages/cron-scripts`](packages/cron-scripts)           | KNX cron job implementations (run in service) |
| [`packages/chronos`](packages/chronos)                     | Minute-resolution cron scheduler              |
| [`packages/db`](packages/db)                               | MariaDB pool + schema migrations              |
| [`packages/transmission`](packages/transmission)           | Transmission BitTorrent RPC client            |
| [`packages/cloudflare`](packages/cloudflare)               | Dynamic DNS (Cloudflare API)                  |
| [`packages/assets`](packages/assets)                       | Lucide icons, weather SVGs, and other media   |
| [`packages/design-tokens`](packages/design-tokens)         | Shared design tokens, dark/light MUI theme    |
| [`packages/i18n-react`](packages/i18n-react)               | Lightweight i18n for React                    |
| [`packages/eslint-config`](packages/eslint-config)         | Shared ESLint config                          |
| [`packages/typescript-config`](packages/typescript-config) | Shared TypeScript config                      |

## Requirements

- Node.js
- Yarn 1.x (`packageManager`: yarn@1.22.22)
- Bun (bundling in `apps/service` and `packages/apollo-ws`)

## Quick start

```sh
yarn install
yarn dev
```

Starts `apps/web` (Vite) and `apps/service` (WebSocket backend on port **3678**) in parallel. The frontend connects via
`ws(s)://<host>/ws` (Vite dev proxy → `:3678`).

Individually:

```sh
yarn workspace web dev
yarn workspace service dev
```

## Root scripts

| Script              | Description                           |
| ------------------- | ------------------------------------- |
| `yarn dev`          | Dev mode for all packages             |
| `yarn build`        | Build all packages (Turbo)            |
| `yarn test`         | Run tests                             |
| `yarn lint`         | ESLint                                |
| `yarn format`       | Prettier (write)                      |
| `yarn format:check` | Prettier (check only)                 |
| `yarn verify`       | format + test + lint + build          |
| `yarn db:migrate`   | Apply MariaDB migrations (`@repo/db`) |
| `yarn db:rollback`  | Revert last migration                 |
| `yarn db:status`    | Show migration state                  |
| `yarn mcp`          | Build MCP + launch Inspector          |

## Architecture

```
apps/service  ──►  @repo/apollo-ws  ──►  WebSocket :3678
       │                                      │
       ├── @repo/knx-schema                   ├── @repo/feed-client ──► apps/web
       ├── @repo/db                           └── apps/mcp (Cursor)
       ├── @repo/cron-scripts (KNX jobs)
       └── scrapers
```

The backend registers feeds (weather, stock market, news, jobs, torrents, energy, heating, CO₂, humidity, room
temperatures, lights) and pushes updates to clients. The frontend subscribes to topics via `@repo/feed-client`.
[`apps/mcp`](apps/mcp) exposes the same data (and light control) to Cursor via MCP tools.

KNX scheduled tasks (energy logging, clock sync, indoor readings) run inside [`apps/service`](apps/service) via
[`@repo/cron-scripts`](packages/cron-scripts). `tv/sony.ts` remains a separate optional script.

## Configuration

- **Service:** copy `apps/service/.env.example` → `.env` (`DB_*` for runtime pool, KNX, location, scraper cookies).
- **Database migrations:** copy `packages/db/.env.example` → `packages/db/.env` (`DB_MIGRATE_*` — can differ from
  service, e.g. DDL user).
- **Web:** optional `VITE_WEBSOCKET_URL` (defaults to `ws(s)://<host>/ws`; Vite dev proxy forwards to `:3678`).
- **MCP:** copy `apps/mcp/.env.example` → `.env` (`APOLLO_WS_URL`, optional `APOLLO_WS_CA_FILE`).

## Tooling

Monorepo built with [Turborepo](https://turbo.build/) and Yarn workspaces. TypeScript, ESLint, and Prettier are
configured centrally in `packages/typescript-config` and `packages/eslint-config`.
