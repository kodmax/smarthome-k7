# `@repo/feeds`

Feed framework used by `apps/service`. Works together with `@repo/apollo-ws` (WebSocket on port **3678**). Client:
`@repo/feed-client`.

Business logic and feed definitions live in `apps/service/src/feeds/**` and `apps/service/src/data-sources/**` — keep
this package infrastructure-only.

## Architecture

```
DataSourceRegistry.add(id, SourceClass)
    → DataSource (fetch / push / cron / maintenance)
    → cache (volatile RAM or persistent JSON / Redis)
    → data-update event
FeedComposer.addFeed(feedId, getByIds([...]), cb)
    → feed event (or getFeedData for in-process read)
Server (@repo/apollo-ws, debounce 1 s)
    → WebSocket clients
```

Shutdown (wired in `apps/service/src/graceful-shutdown.ts`): `DataSourceRegistry.close()` stops Chronos jobs, then
`Server.close()` clears debounce timers and closes WebSocket connections.

## Event bus (`FeedEvents`)

Create one instance in service and pass it to `Server.listen()`, `DataSourceRegistry`, and `FeedComposer`. Pass Pino
`Logger` via options for operational logging.

| Event           | Payload                        | When                                                  |
| --------------- | ------------------------------ | ----------------------------------------------------- |
| `feed`          | `feedId`, `value`              | Feed composed successfully                            |
| `data-update`   | `sourceId`                     | Source cache changed after push, fetch, or cron       |
| `refresh`       | `sourceId`                     | Request forced refresh (`getData(true)`) of a source  |
| `error`         | `sourceId`, `error`, `context` | Data source error (handled in service entrypoint)     |
| `feeds-request` | `feedIds[]`                    | Client subscribe — compose feed from source cache/TTL |

### When to use events vs `onError`

| Mechanism                         | When                                                                                                                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FeedEvents` (`error`)            | **Async entry points** — KNX callbacks, timers, etc. where `reportError` emits on the event bus.                                                                                   |
| `onError` (injected from service) | **In-process async flow** — errors in `FeedComposer`, `DataSource`, `DataSourceRegistry` while feeds infrastructure is already on the stack; log + `onError` inline at catch site. |

Do **not** route all feeds errors through `FeedEvents` — the event bus is not an error bus.

## How feeds are composed (two paths)

**Client subscribe** (`feeds-request`): every source in the feed gets `getData()`. Sources finish at different times;
each success emits `data-update` and may trigger another composition pass.

**Push / cron** (`data-update` handler): `feed(feedId, sourceId)` runs with `triggeredBy` set. The **trigger** source
uses `getRecentContent()` (push already wrote to cache before emitting `data-update`; KNX volatile cache stays warm in
RAM). Other sources in the same feed use `ensureContent()` — read from cache when available, otherwise fetch without
emitting another `data-update`. Do **not** use `getRecentContent()` for all sources (regression from 28fb434): siblings
without cache would return `null` from `getRecentContent()`; if the **trigger** source has no cache, `FeedComposer`
skips the feed event entirely.

**Subscribe** (`feeds-request`, no `triggeredBy`): every source uses `getData()`, which may emit `data-update` after
refresh — intentional; the server debounce merges rapid multi-source updates.

**In-process read** (`getFeedData(feedId)`): composes and returns the same payload as the `feed` event / WebSocket
`FEED <id> <json>`, without emitting `feed`. Uses the same subscribe path as `feeds-request`. Concurrent calls for the
same `feedId` (e.g. multiple clients GET-ing after a WS change event) share one in-flight composition and receive the
same result.

## Intentional behavior — do not "fix"

- **1 s debounce** on `feed` in `Server` — multi-source feeds update one source at a time; debounce sends one broadcast
  with the final combined state. Do not add per-source debounce or remove the global timer.
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
`Server` protocol/debounce (in `@repo/apollo-ws`). Cron scheduling lives in `@repo/chronos`.
