# @repo/cron-scripts

Scheduled job implementations for the smart home backend. KNX jobs run **inside** `apps/service` via `initKnxCronJobs()`
— not as standalone CLI scripts.

## KNX jobs (via service)

| File                                | Schedule (cron) | Description                      |
| ----------------------------------- | --------------- | -------------------------------- |
| `src/knx/log-daily-consumption.ts`  | `0 0 * * *`     | Daily energy consumption logs    |
| `src/knx/clocks-sync.ts`            | `0 * * * *`     | Sync KNX system clock datapoints |
| `src/knx/log-hourly-consumption.ts` | `0 * * * *`     | Hourly energy readings → MariaDB |
| `src/knx/log-air-condition.ts`      | `*/15 * * * *`  | Temperature, humidity, CO₂ logs  |

Service wires these in [`src/knx/schedule.ts`](src/knx/schedule.ts) and starts them when KNX is enabled (`NO_CRON`
unset).

## Standalone script

| File             | Description                                        |
| ---------------- | -------------------------------------------------- |
| `src/tv/sony.ts` | Turn off Sony Bravia when there is no input signal |

Not integrated into service yet — run manually after build if needed.

## Environment variables

| Variable                                         | Used by                               |
| ------------------------------------------------ | ------------------------------------- |
| `KNX_HOST`                                       | KNX jobs (via service)                |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_SCHEMA` | Runtime pool via service → `@repo/db` |
| `SONY_TV_IP`, `SONY_TV_SECRET`                   | `tv/sony.ts`                          |

Service loads `apps/service/.env`. For `tv/sony.ts`, development uses `.env` via `src/config/env.ts`.

## Monorepo dependencies

- `@repo/chronos` — cron scheduler
- `@repo/db` — shared MariaDB pool
- `@repo/knx-schema` — KNX addresses (same as service)
- `@repo/typescript-config` — TypeScript config

## Scripts

| Script      | Description                              |
| ----------- | ---------------------------------------- |
| `build`     | `tsc` → `dist/` (ESM)                    |
| `dev`       | `tsc --watch` — rebuilds `dist/` on save |
| `typecheck` | Type checking                            |
| `clean`     | Removes `dist/`                          |
| `format`    | Prettier                                 |

## Stack

TypeScript (NodeNext/ESM), `js-knx`, `@repo/db`, `sony-bravia-ip-control`.
