# @repo/knx-schema

Single source of truth for KNX group addresses and DPT types in the home installation.

## Contents

Exports `knxSchema` from `src/home.knx-schema.ts` — sections include:

- system clocks
- air quality (CO₂, humidity)
- energy and heating
- room temperatures
- lights (`home.lights.ts`)

## Usage

```ts
import { knxSchema } from '@repo/knx-schema'
```

Consumers:

- [`apps/service`](../../apps/service) — live KNX feeds
- [`packages/cron-scripts`](../cron-scripts) — scheduled tasks (logging, clock sync)

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `build`           | `tsc` → `dist/`   |
| `lint` / `format` | ESLint / Prettier |

## Stack

TypeScript, DPT types from `js-knx`.
