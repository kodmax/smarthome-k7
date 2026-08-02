# @repo/feeds

Real-time feed framework — data source registry and feeds collection.

## API

Exports from `src/index.ts`:

- `Feeds` — feed and data source registry
- `DataSource` — single source (fetch, cron, cache)
- `Cache` — on-disk result persistence
- `Feeds`, `DataSource` — accept injected Pino `Logger` via options

## Usage

Primary consumer is [`apps/service`](../../apps/service), which registers feeds and starts the server.

```sh
yarn workspace @repo/feeds build
yarn workspace @repo/feeds test
```

## Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `build`           | `tsc` → `dist/` (JS + `.d.ts`) |
| `test`            | Vitest                         |
| `lint` / `format` | ESLint / Prettier              |

Package entry: `dist/index.js` with types in `dist/index.d.ts`. Cron scheduling lives in [`@repo/chronos`](../chronos).
Agent notes: [`AGENTS.md`](./AGENTS.md).

## Stack

TypeScript, redis, eslink.
