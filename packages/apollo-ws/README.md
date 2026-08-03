# @repo/apollo-ws

WebSocket server for the smart home dashboard — protocol, client subscriptions, command routing, and feed broadcast.

Feed composition and data sources live in [`@repo/feeds`](../feeds).

## API

Exports from `src/index.ts`:

- `Server` — WebSocket server (default port **3678**)
- `Server.listen({ feedEvents, logger, onError, port? })` — shares one `FeedEvents` instance with `@repo/feeds`

Message protocol: `FEED <topic> <json>`. Subscriptions and commands are handled by [`@repo/feed-client`](../feed-client)
on the client side.

## Usage

Primary consumer is [`apps/service`](../../apps/service):

```ts
const feedEvents = new FeedEvents()
const apollo = await Server.listen({ feedEvents, logger, onError })
```

Incoming client messages emit on `feedEvents` (`feeds-request`, `feeds-refresh`, `command`). Outgoing updates listen on
`feed` (1 s debounce per topic).

## Scripts

| Script            | Description                                   |
| ----------------- | --------------------------------------------- |
| `build`           | `rm -rf dist && tsc` → `dist/` (JS + `.d.ts`) |
| `test`            | Vitest                                        |
| `lint` / `format` | ESLint / Prettier                             |

Agent notes: [`AGENTS.md`](./AGENTS.md).

## Stack

TypeScript, `ws`. Service bundles with esbuild; this package ships compiled JS only.
