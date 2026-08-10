# @repo/feeds

Feed framework for `apps/service` — data sources, cache, registry, and feed composition. WebSocket transport lives in
[`apps/service`](../../apps/service) (Nest gateway at `/ws`).

## Architecture

```
DataSourceRegistry.add(id, SourceClass)   ← creates DataSource, per-source cron + maintenance at 03:00
        ↓
FeedComposer.addFeed(feedId, getByIds([...]), cb)   ← composes multi-source feeds
        ↓
FeedEvents (feed-changed / data-update / refresh / error)
        ↓
Nest FeedWebSocketService   ← debounce + FEED-UPDATE <id> notification
```

Business logic (scrapers, KNX classes, feed wiring) stays in [`apps/service`](../../apps/service). This package is
infrastructure only.

## API

Exports from `src/index.ts`:

| Export                   | Role                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `DataSourceRegistry`     | Register source classes, cron + maintenance, `getByIds()`                                  |
| `FeedComposer`           | Compose feeds from ready-made `DataSource` instances; `getFeedData()` for in-process reads |
| `DataSource`             | Fetch, push, cache, cron                                                                   |
| `FeedEvents`             | Shared event bus (service passes one instance to WS + registry + feeds)                    |
| `FSCache` / `RedisCache` | Persistent or volatile cache backends                                                      |

## Usage (in service)

```ts
const feedEvents = new FeedEvents()

feedEvents.on('error', (sourceId, error, context) => {
  logger.child({ component: 'data-source' }).warn({ err: error, sourceId }, context)
  onError(error, context)
})

const cache = new FSCache(config.cache.dir)
const dataSourceChronos = new Chronos({ logger, executionStore })

const dataSources = new DataSourceRegistry<DataSourceRegistryType>({
  cache,
  chronos: dataSourceChronos,
  feedEvents,
  logger,
  onError,
  observeDataSourceRefresh,
})

const feeds = new FeedComposer(feedEvents, { logger, onError })

await dataSources.add('weather', WeatherSource)
await feeds.addFeed('weather', dataSources.getByIds(['weather']), ({ weather }) => weather)

const payload = await feeds.getFeedData('weather') // REST GET /feeds/weather
```

Shutdown: `dataSources.close()` stops Chronos jobs (wired in `apps/service/src/graceful-shutdown.ts`).

## Scripts

| Script            | Description                                   |
| ----------------- | --------------------------------------------- |
| `build`           | `rm -rf dist && tsc` → `dist/` (JS + `.d.ts`) |
| `test`            | Vitest                                        |
| `lint` / `format` | ESLint / Prettier                             |

Agent notes: [`AGENTS.md`](./AGENTS.md). Cron scheduling uses [`@repo/chronos`](../chronos).

## Stack

TypeScript, Pino (`@repo/logger`), optional Redis cache.
