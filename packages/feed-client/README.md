# @repo/feed-client

React client library for the Apollo WebSocket protocol — feed subscriptions and commands to the backend.

## API

| Export                 | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `useFeed(topic)`       | Hook — subscribes to a topic, returns the latest payload |
| `useCommand()`         | Sends a command to a data source                         |
| `refreshFeeds(topics)` | Forces a refresh of selected feeds                       |

Default WebSocket URL: same host and scheme as the page (`ws(s)://<host>/ws`, overridable via `VITE_WEBSOCKET_URL`).

## Usage

Consumed exclusively by [`apps/web`](../../apps/web):

```tsx
import { useFeed } from '@repo/feed-client'
import type { WeatherFeed } from '@repo/types'

const weather = useFeed<WeatherFeed>('weather')
```

Calling `useFeed` with the same topic from multiple components is fine: the client keeps one WebSocket subscription per
topic and fans out updates to every hook instance. You do not need a React context wrapper to share feed data.

The package exports TypeScript source with no separate build step — Vite compiles it together with the web app.

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `lint` / `format` | ESLint / Prettier |
