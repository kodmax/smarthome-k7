# `@repo/apollo-ws`

WebSocket transport for `apps/service`. Port **3678** by default. Feed logic is in `@repo/feeds` — this package only
handles the wire protocol and client lifecycle.

## Responsibilities

- Accept WebSocket connections
- Parse client messages → emit on shared `FeedEvents` (`feeds-request`, `feeds-refresh`, `command`)
- Listen for `feed` events → debounce 1 s per topic → broadcast `FEED <id> <json>`
- `Server.close()` — clear debounce timers, close connections

## Wiring (service)

One `FeedEvents` instance is shared by `Server`, `DataSourceRegistry`, and `FeedManager`:

```ts
const feedEvents = new FeedEvents()
const dataSources = new DataSourceRegistry({ feedEvents, cache, ... })
const feeds = new FeedManager(feedEvents, { logger, onError })
const apollo = await Server.listen({ feedEvents, logger, onError })
```

Shutdown order in `apps/service/src/graceful-shutdown.ts`: KNX cron → `dataSources.close()` → KNX disconnect →
`apollo.close()`.

## Intentional behavior — do not "fix"

- **1 s debounce** on outgoing `feed` — multi-source feeds update one source at a time; debounce sends one broadcast
  with the final combined state.

## Scripts

```sh
yarn build   # tsc → dist/
yarn test    # vitest (Server protocol)
yarn lint
```

For data sources, cache, feed composition, and cron — see [`packages/feeds/AGENTS.md`](../feeds/AGENTS.md).
