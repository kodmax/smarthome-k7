# service

Dashboard backend — aggregates data from KNX, web scrapers, and MariaDB, and publishes it as WebSocket feeds.

## Stack

- Node.js (CommonJS), TypeScript
- Bun (bundling)
- `@repo/apollo-ws`, `js-knx`, MariaDB, Vitest

## Running

```sh
cp .env.example .env   # fill in values

yarn workspace service dev    # watch + node --watch
yarn workspace service start  # production (after build)
```

The WebSocket server listens on port **3678**.

## Environment variables

Copy `.env.example` and fill in:

| Variable                                         | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA` | MariaDB connection                               |
| `KNX_HOST`                                       | KNX gateway address (required unless `NO_KNX=1`) |
| `NO_KNX`                                         | `1` — disables KNX feeds                         |
| `CACHE_DIR`                                      | Feed cache directory (default `.cache`)          |
| `LOCATION_LAT`, `LOCATION_LONG`                  | Coordinates (weather, suncalc)                   |
| `GOOGLE_SOCS_COOKIE`                             | Cookie for Google weather scraping               |
| `NFJ_COOKIE`, `THEPROTOCOL_COOKIE`               | Cookies for job board scraping                   |

## Feeds

**Web (scraping):** `weather`, `stock-market`, `news`, `jobs`, `top-torrents`

**KNX:** energy, heating, CO₂, humidity, room temperatures

## Scripts

| Script                     | Description                     |
| -------------------------- | ------------------------------- |
| `dev`                      | Bundle + watch + `node --watch` |
| `build`                    | `tsc` + Bun bundle              |
| `bundle`                   | `bun build` → `dist/`           |
| `start`                    | `node dist/index.js`            |
| `test` / `lint` / `format` | Vitest / ESLint / Prettier      |

## Monorepo dependencies

| Package            | Role                                   |
| ------------------ | -------------------------------------- |
| `@repo/apollo-ws`  | WebSocket server, cache, feed registry |
| `@repo/knx-schema` | KNX group address map                  |
| `@repo/types`      | Feed payload type contracts            |

Entry point: `src/index.ts`.
