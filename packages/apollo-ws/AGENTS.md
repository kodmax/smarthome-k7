# `@repo/apollo-ws`

Real-time feed framework used by `apps/service`. WebSocket server on port **3678**, feed registry, disk cache, cron
refresh, KNX push/command routing. Client: `@repo/feed-client`.

Business logic and feed definitions live in `apps/service/src/feeds/**` — keep this package infrastructure-only.

## Architecture

```
DataSource (fetch / push / cron)
    → cache (volatile RAM or persistent JSON)
    → data-update event
Feeds (compose multi-source feed, callback)
    → feed event
Server (debounce 1 s, broadcast FEED <id> <json>)
    → WebSocket clients
```

Shutdown (wired in `apps/service/src/graceful-shutdown.ts`): `Feeds.close()` stops cron, then `Server.close()` clears
debounce timers and closes WebSocket connections.

## Event bus (`ApolloEvents`)

Typed wrapper over Node `EventEmitter`. Create one instance on `Server.vent` and pass it into `Feeds` (and `sysLog()`).

| Event           | Payload                   | When                                                  |
| --------------- | ------------------------- | ----------------------------------------------------- |
| `feed`          | `feedId`, `value`         | Feed composed successfully                            |
| `sys-log`       | `priority`, `msg`, `err?` | Logging (see `sysLog()`)                              |
| `data-update`   | `sourceId`                | Source cache changed after push, fetch, or cron       |
| `command`       | `DataSourceCommand`       | WS client command routed to push sources              |
| `feeds-request` | `feedIds[]`               | Client subscribe — compose feed, refresh all sources  |
| `feeds-refresh` | `feedIds`                 | Client refresh — force `getData(true)` on all sources |

## How feeds are composed (two paths)

**Client subscribe / refresh** (`feeds-request`, `feeds-refresh`): every source in the feed gets `getData()` (or
`getData(true)` on refresh). Sources finish at different times; each success emits `data-update` and may trigger another
composition pass.

**Push / cron** (`data-update` handler): `feed(feedId, sourceId)` runs with `triggeredBy` set. **All** sources in that
feed use `getRecentContent()` — not `getData()`. Push already wrote to cache before emitting `data-update`; KNX volatile
cache stays warm in RAM so clients rarely need a burst of `dp.read()` on subscribe.

If any source has no cached content, `getRecentContent()` throws `NoRecentContent`; `Feeds` swallows it
(`NonErrorException`) and skips the `feed` event for that attempt. A later source update or client subscribe usually
succeeds once every source has cache.

## Intentional behavior — do not "fix"

- **1 s debounce** on `feed` in `Server` — multi-source feeds update one source at a time; debounce sends one broadcast
  with the final combined state. Do not add per-source debounce or remove the global timer.
- **Refresh log at priority 4** in `DataSource` — successful fetch is logged as warning; cache hit stays at 7 (debug).
  This is deliberate visibility, not a bug.
- **No stale fallback** when `script()` fails — reject and let UI show missing data; do not serve old cache after a
  failed refresh.
- **Corrupt cache JSON** on disk → `CorruptCacheError` at startup (fail-fast). **ENOENT** → empty cache (normal first
  run).
- **KNX push without UI** still updates source cache — that is required so subscribe can hit warm volatile cache later.
  Do not skip `data-update` / feed composition based on subscriber count (evaluated and rejected as overkill for this
  deployment).

## Feed conventions

- Register feeds via `feeds.addFeed(feedId, sources, cb?)` in `apps/service`.
- `addFeed` is fully typed: callback receives `SourceDataTypes<S>`. Internally stored as `FeedCb`
  (`Record<string, unknown>` → `unknown`) because feeds live in a homogeneous `Map`.
- Reuse data sources by stable `id` (import singletons like `indoorTempHistory`). Same definition object → shared
  `DataSource`. Same `id`, different object → `DuplicateDataSourceIdError`.
- `volatile: true` — in-memory cache only (typical KNX push sources). Persistent sources use JSON files under the cache
  directory.

## Scripts

```sh
yarn build   # tsc → dist/ (+ .d.ts)
yarn test    # vitest
yarn lint
```

## Tests still to add (P4)

`Feeds.test.ts` covers data-source registration. Still missing: `DataSource`, `Server` protocol/debounce,
`Cache`/`CacheEntry`, `Chronos` scheduling and `stop()`.
