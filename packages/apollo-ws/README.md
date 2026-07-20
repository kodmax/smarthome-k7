# @repo/apollo-ws

Real-time feed framework — WebSocket server, data source registry, file cache, and update broadcast.

## API

Exports from `src/index.ts`:

- `Server` — WebSocket server (default port **3678**)
- `Feeds` — feed and data source registry
- `DataSource` — single source (fetch, cron, cache)
- `Cache` — on-disk result persistence
- `sysLog` — system logging

Message protocol: `FEED <topic> <json>`. Client-side subscriptions and commands are handled by `@repo/feed-client`.

## Usage

Primary consumer is [`apps/service`](../../apps/service), which registers feeds and starts the server.

```sh
yarn workspace @repo/apollo-ws build
yarn workspace @repo/apollo-ws test
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

TypeScript, `ws`, Bun (bundling).
