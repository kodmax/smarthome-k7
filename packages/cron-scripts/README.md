# @repo/cron-scripts

Node.js scripts run on a schedule (cron/systemd) — independent of the long-running `apps/service`.

## Scripts

| File | Description |
|------|-------------|
| `src/knx/clocks-sync.ts` | Sync KNX system clock datapoints |
| `src/knx/log-hourly-consumption.ts` | Hourly energy readings → MariaDB |
| `src/knx/log-daily-consumption.ts` | Daily energy consumption logs |
| `src/knx/log-air-condition.ts` | Temperature, humidity, CO₂ logs |
| `src/tv/sony.ts` | Turn off Sony Bravia when there is no input signal |

After building, run files from `dist/`, e.g.:

```sh
yarn workspace @repo/cron-scripts build
node packages/cron-scripts/dist/knx/log-hourly-consumption.js
```

## Environment variables

| Variable | Scripts |
|----------|---------|
| `KNX_HOST` | All KNX scripts |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA` | Scripts that write to the database |
| `SONY_TV_IP`, `SONY_TV_SECRET` | `tv/sony.ts` |

In development, `.env` is loaded via `src/config/env.ts`.

## Monorepo dependencies

- `@repo/knx-schema` — KNX addresses (same as service)
- `@repo/typescript-config` — TypeScript config

## Scripts

| Script | Description |
|--------|-------------|
| `build` | `tsc` → `dist/` (ESM) |
| `typecheck` | Type checking |
| `clean` | Removes `dist/` |
| `format` | Prettier |

## Stack

TypeScript (NodeNext/ESM), `js-knx`, MariaDB, `sony-bravia-ip-control`.
