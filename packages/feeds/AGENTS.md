# `@repo/feeds`

Feed framework used by `apps/service`. WebSocket transport: Nest gateway in `apps/service` (`/ws` on port **3679**).
Client: `@repo/feed-client`.

Business logic and feed definitions live in `apps/service/src/feeds/**` and `apps/service/src/data-sources/**` — keep
this package infrastructure-only.

## Architecture

```
DataSourceRegistry.add(id, SourceClass)
    → DataSource (fetch / push / cron / maintenance)
    → cache (volatile RAM or persistent JSON / Redis)
    → data-update event
FeedComposer.addFeed(feedId, getByIds([...]), cb)
    → feed-changed event (or getFeedData for REST read)
FeedWebSocketService (Nest, debounce 1 s)
    → WebSocket FEED-UPDATE notifications
```

Shutdown (wired in `apps/service/src/graceful-shutdown.ts`): `DataSourceRegistry.close()` stops Chronos jobs; Nest
`close()` clears WebSocket debounce timers and connections.

## Event bus (`FeedEvents`)

Create one instance in service and pass it to `DataSourceRegistry`, `FeedComposer`, and Nest `EventsModule`. Pass Pino
`Logger` via options for operational logging.

| Event             | Payload                        | When                                                 |
| ----------------- | ------------------------------ | ---------------------------------------------------- |
| `feed-changed`    | `feedId`                       | Source in feed updated — notify WS clients           |
| `data-update`     | `sourceId`                     | Source cache changed after push, fetch, or cron      |
| `refresh`         | `sourceId`                     | Request forced refresh (`getData(true)`) of a source |
| `error`           | `sourceId`, `error`, `context` | Data source error (handled in service entrypoint)    |
| `clients-changed` | `count`                        | WebSocket connect/disconnect                         |

### When to use events vs `onError`

| Mechanism                         | When                                                                                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FeedEvents` (`error`)            | **Async entry points** — KNX callbacks, timers, etc. where `reportError` emits on the event bus.                                                                                   |
| `onError` (injected from service) | **In-process async flow** — errors in `FeedComposer`, `DataSource`, `DataSourceRegistry` while feeds infrastructure is already on the stack; log + `onError` inline at catch site. |

Do **not** route all feeds errors through `FeedEvents` — the event bus is not an error bus.

## How feeds are composed

**REST read** (`getFeedData(feedId)`): every source uses `ensureContent()` — cache hit when available, fetch on miss
without emitting `data-update`. Concurrent GETs for the same `feedId` share one in-flight composition.

**Push / cron** (`data-update` handler): emits `feed-changed` for each feed containing the updated source. No
server-side composition for WS — clients fetch via REST after receiving `FEED-UPDATE <feedId>`.

## Intentional behavior — do not "fix"

- **1 s debounce** on `feed-changed` in `Server` — multi-source feeds update one source at a time; debounce sends one
  notification with the final combined state. Do not add per-source debounce or remove the global timer.
- **Refresh log at `info`** in `DataSource` — successful fetch is logged at info; cache hit stays at debug. This is
  deliberate visibility, not a bug.
- **No stale fallback** when `script()` fails — reject and let UI show missing data; do not serve old cache after a
  failed refresh.
- **Corrupt cache JSON** on disk → `CorruptCacheError` at startup (fail-fast). **ENOENT** → empty cache (normal first
  run).
- **KNX push without UI** still updates source cache — that is required so subscribe can hit warm volatile cache later.
  Do not skip `data-update` / feed composition based on subscriber count (evaluated and rejected as overkill for this
  deployment).

## Feed conventions

- Register data sources via `dataSources.add(id, SourceClass)` in `apps/service`. Each source class declares
  `static getId()`, `static getCacheTTL()`, optionally `static getCron()`, `static getCronPolicy()`, and optionally
  overrides `static isVolatile()` (default `false`).
- `DataSourceRegistry` receives a configured `Chronos` instance from `apps/service` (with optional `executionStore` for
  misfire recovery).
- Compose feeds via `feeds.addFeed(feedId, dataSources.getByIds([...]), cb)` — callback is required.
- `addFeed` is fully typed: callback receives `DataSourceDataTypes<S>`. Internally stored as `FeedCb`
  (`Record<string, unknown>` → `unknown`) because feeds live in a homogeneous `Map`.
- Reuse data sources by registry key — `getByIds` returns the same instance registered once in `DataSourceRegistry`.
- Cron jobs for data sources (per-source refresh + per-source maintenance at 03:00, namespace
  `data-source-maintenance/{sourceId}`) are registered in `DataSourceRegistry.add()`.
- KNX sources: class per group address in `apps/service/src/data-sources/knx/`, barrel `knx/index.ts`.
- `volatile: true` — in-memory cache only (typical KNX push sources). Persistent sources use JSON files under the cache
  directory.

## Scripts

```sh
yarn build   # rm -rf dist && tsc → dist/ (+ .d.ts)
yarn test    # vitest
yarn lint
```

## Tests still to add (P4)

`FeedComposer.test.ts` and `DataSourceRegistry.test.ts` cover registration, composition, and maintenance. Still missing:
`FeedWebSocketService` protocol/debounce (in `apps/service`). Cron scheduling lives in `@repo/chronos`.
