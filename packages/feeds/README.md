# @repo/feeds

Feed framework for `apps/service` — data sources, cache, registry, and feed composition. WebSocket transport lives in
[`@repo/apollo-ws`](../apollo-ws).

## Architecture

```
DataSourceRegistry.add(id, SourceClass)   ← creates DataSource, per-source cron, nightly maintenance
        ↓
FeedManager.addFeed(feedId, getByIds([...]), cb)   ← composes multi-source feeds
        ↓
FeedEvents (feed / data-update / push / error / command / feeds-request / feeds-refresh)
        ↓
@repo/apollo-ws Server   ← debounce + FEED <id> <json> broadcast
```

Business logic (scrapers, KNX classes, feed wiring) stays in [`apps/service`](../../apps/service). This package is
infrastructure only.

## API

Exports from `src/index.ts`:

| Export                                | Role                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `DataSourceRegistry`                  | Register source classes, cron + maintenance, `getByIds()`               |
| `FeedManager`                         | Compose feeds from ready-made `DataSource` instances                    |
| `DataSource` / `DataSourceDefinition` | Fetch, push, cache, commands                                            |
| `FeedEvents`                          | Shared event bus (service passes one instance to WS + registry + feeds) |
| `FSCache` / `RedisCache`              | Persistent or volatile cache backends                                   |

## Usage (in service)

```ts
const feedEvents = new FeedEvents()

feedEvents.on('error', (sourceId, error, context) => {
  logger.child({ component: 'data-source' }).warn({ err: error, sourceId }, context)
  onError(error, context)
})

const cache = new FSCache(config.cache.dir)

const dataSources = new DataSourceRegistry<DataSourceRegistryType>({
  cache,
  feedEvents,
  logger,
  onError,
  observeDataSourceRefresh,
})

const feeds = new FeedManager(feedEvents, { logger, onError })

await dataSources.add('weather', WeatherSource)
await feeds.addFeed('weather', dataSources.getByIds(['weather']), ({ weather }) => weather)
```

Shutdown: `dataSources.close()` stops Chronos jobs (wired in `apps/service/src/graceful-shutdown.ts`).

## Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `build`           | `tsc` → `dist/` (JS + `.d.ts`) |
| `test`            | Vitest                         |
| `lint` / `format` | ESLint / Prettier              |

Agent notes: [`AGENTS.md`](./AGENTS.md). Cron scheduling uses [`@repo/chronos`](../chronos).

## Stack

TypeScript, Pino (`@repo/logger`), optional Redis cache.
