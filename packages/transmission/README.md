# @repo/transmission

Transmission BitTorrent daemon RPC client for the backend.

Includes a generic JSON-RPC 2.0 HTTP client and a Transmission-specific wrapper that handles session IDs and HTTP basic auth.

## Runtime API

Callers must load env before first access (e.g. `apps/service/src/config.ts` loads `apps/service/.env`).

```ts
import { getTransmissionClient } from '@repo/transmission'

const { torrents } = await getTransmissionClient().call<{ torrents: unknown[] }>('torrent-get', {
  fields: ['id', 'name', 'status', 'rateDownload', 'rateUpload'],
})
```

Config reads `TRANSMISSION_URL` (required), `TRANSMISSION_USERNAME`, and `TRANSMISSION_PASSWORD` from `process.env`.

## Generic JSON-RPC 2.0 client

For other JSON-RPC 2.0 endpoints:

```ts
import { JsonRpcClient } from '@repo/transmission'

const rpc = new JsonRpcClient({ url: 'http://localhost:8080/rpc' })
const result = await rpc.call<{ version: string }>('getVersion')
```

## Setup

```sh
cp packages/transmission/.env.example packages/transmission/.env
# fill TRANSMISSION_URL and optional credentials
```

Or add the same variables to `apps/service/.env` when used from the service.

## Scripts

| Script | Description |
|--------|-------------|
| `build` | Compile runtime to `dist/` |
| `dev` | `tsc --watch` |

## Layout

```
src/
  config.ts              # env helpers
  jsonRpcClient.ts       # generic JSON-RPC 2.0 over HTTP
  transmissionClient.ts  # Transmission RPC (session id, auth)
  index.ts
```
