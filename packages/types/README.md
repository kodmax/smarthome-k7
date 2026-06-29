# @repo/types

Shared TypeScript types for feed payloads and domain models — the contract between backend and frontend.

## Scope

Types in `src/feed.ts` (re-exported from `src/index.ts`):

- weather, energy, heating, air quality
- stock market, currencies, commodities
- news, jobs, torrents
- KNX readings

## Usage

```ts
import type { WeatherFeed, EnergyFeed } from '@repo/types'
```

Consumers:

- [`apps/web`](../../apps/web) — types in card components
- [`apps/service`](../../apps/service) — feed data shapes

Types only — no runtime code, no build step.

## Scripts

| Script | Description |
|--------|-------------|
| `lint` / `format` | ESLint / Prettier |
