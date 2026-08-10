# `@repo/apollo-ws`

WebSocket transport for `apps/service`. Port **3678** by default. Feed logic is in `@repo/feeds` — this package only
handles the wire protocol and client lifecycle.

## Responsibilities

- Accept WebSocket connections
- Parse client `subscribe` messages — register feed interest for notifications
- Listen for `feed-changed` events → debounce 1 s per topic → broadcast `FEED-UPDATE <id>`
- `Server.close()` — clear debounce timers, close connections

## Wiring (service)

One `FeedEvents` instance is shared by `Server`, `DataSourceRegistry`, and `FeedComposer`:

```ts
const feedEvents = new FeedEvents()
const dataSources = new DataSourceRegistry({ feedEvents, cache, ... })
const feeds = new FeedComposer(feedEvents, { logger, onError })
const apollo = await Server.listen({ feedEvents, logger, onError })
```

Shutdown order in `apps/service/src/graceful-shutdown.ts`: KNX cron → `dataSources.close()` → KNX disconnect →
`apollo.close()`.

## Intentional behavior — do not "fix"

- **1 s debounce** on outgoing `feed-changed` — multi-source feeds update one source at a time; debounce sends one
  notification with the final combined state.

## Scripts

```sh
yarn build   # rm -rf dist && tsc → dist/
yarn test    # vitest (Server protocol)
yarn lint
```

For data sources, cache, feed composition, and cron — see [`packages/feeds/AGENTS.md`](../feeds/AGENTS.md).
