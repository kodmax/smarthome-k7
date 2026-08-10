# @repo/feed-client

React client library for the smarthome backend — REST feed reads, WebSocket change notifications, and HTTP commands.

## API

| Export                     | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `useFeed(topic)`           | Hook — fetches feed via REST, refreshes on `FEED-UPDATE` |
| `fetchFeed(feedId)`        | Imperative REST fetch (`GET /api/feeds/:feedId`)         |
| `useCommand(source, name)` | Hook — sends a typed command via HTTP                    |
| `sendCommand`              | Imperative command sender (same HTTP transport)          |

Feed content uses HTTP (`GET /api/feeds/{feedId}`). Change notifications use WebSocket (`FEED-UPDATE {feedId}` on
`ws(s)://<host>/ws`).

Commands use HTTP (`/api/data-sources/{sourceId}/command/{name}`).

All URLs are derived from the same backend origin (`window.location.origin` by default, overridable via
`VITE_BACKEND_BASE_URL`).

## Usage

Consumed exclusively by [`apps/web`](../../apps/web):

```tsx
import { useFeed, useCommand } from '@repo/feed-client'
import type { WeatherFeed } from '@repo/types'

const weather = useFeed<WeatherFeed>('weather')
const fav = useCommand('job-ads', 'fav')
fav('jj-123')
```

Calling `useFeed` with the same topic from multiple components is fine: the client keeps one WebSocket subscription per
topic and fans out updates to every hook instance. You do not need a React context wrapper to share feed data.

The package exports TypeScript source with no separate build step — Vite compiles it together with the web app.

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `lint` / `format` | ESLint / Prettier |
| `test`            | Vitest            |
