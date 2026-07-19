# smarthome-k7

Smart home dashboard monorepo: the backend aggregates data from KNX and web scrapers; the frontend displays it live over
WebSocket.

## Structure

| Directory                                                  | Description                                   |
| ---------------------------------------------------------- | --------------------------------------------- |
| [`apps/web`](apps/web)                                     | React dashboard (Vite, MUI)                   |
| [`apps/service`](apps/service)                             | Backend — feeds, cache, WebSocket             |
| [`packages/apollo-ws`](packages/apollo-ws)                 | WebSocket server and feed registry            |
| [`packages/feed-client`](packages/feed-client)             | React hooks for feed subscriptions            |
| [`packages/types`](packages/types)                         | Shared feed payload types                     |
| [`packages/knx-schema`](packages/knx-schema)               | KNX group address map                         |
| [`packages/cron-scripts`](packages/cron-scripts)           | KNX cron job implementations (run in service) |
| [`packages/db`](packages/db)                               | MariaDB pool + schema migrations              |
| [`packages/cloudflare`](packages/cloudflare)               | Dynamic DNS (Cloudflare API)                  |
| [`packages/assets`](packages/assets)                       | Lucide icons, weather SVGs, and other media   |
| [`packages/design-tokens`](packages/design-tokens)         | Shared design tokens, dark/light MUI theme    |
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

Starts `apps/web` (Vite) and `apps/service` (WebSocket on port **3678**) in parallel.

Individually:

```sh
yarn workspace web dev
yarn workspace service dev
```

## Root scripts

| Script            | Description                           |
| ----------------- | ------------------------------------- |
| `yarn dev`        | Dev mode for all packages             |
| `yarn build`      | Build all packages (Turbo)            |
| `yarn test`       | Run tests                             |
| `yarn lint`       | ESLint                                |
| `yarn format`     | Prettier                              |
| `yarn db:migrate` | Apply MariaDB migrations (`@repo/db`) |

## Architecture

```
apps/service  ──►  @repo/apollo-ws  ──►  WebSocket :3678
       │                                      │
       ├── @repo/knx-schema                   ▼
       ├── @repo/db                           @repo/feed-client
       ├── @repo/cron-scripts (KNX jobs)          │
       └── scrapers                               ▼
                                            apps/web
```

The backend registers feeds (weather, stock market, news, jobs, torrents, energy, heating, CO₂, humidity, room
temperatures) and pushes updates to clients. The frontend subscribes to topics via `@repo/feed-client`.

KNX scheduled tasks (energy logging, clock sync, indoor readings) run inside [`apps/service`](apps/service) via
[`@repo/cron-scripts`](packages/cron-scripts). `tv/sony.ts` remains a separate optional script.

## Configuration

- **Service:** copy `apps/service/.env.example` → `.env` (`DB_*` for runtime pool, KNX, location, scraper cookies).
- **Database migrations:** copy `packages/db/.env.example` → `packages/db/.env` (`DB_MIGRATE_*` — can differ from
  service, e.g. DDL user).
- **Web:** optional `VITE_WEBSOCKET_URL` (defaults to `ws://<hostname>:3678`).

## Tooling

Monorepo built with [Turborepo](https://turbo.build/) and Yarn workspaces. TypeScript, ESLint, and Prettier are
configured centrally in `packages/typescript-config` and `packages/eslint-config`.
