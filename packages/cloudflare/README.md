# cloudflare

Standalone Cloudflare dynamic DNS updater — compares the public IP to an A record and updates it when it changes.

## Usage

```sh
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ZONE_ID=...
export CLOUDFLARE_DOMAIN=sub.example.com

yarn workspace cloudflare build
node packages/cloudflare/dist/src/dns-update.js
```

Typical setup: a crontab entry every few minutes.

## Environment variables

| Variable               | Description             |
| ---------------------- | ----------------------- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token    |
| `CLOUDFLARE_ZONE_ID`   | DNS zone ID             |
| `CLOUDFLARE_DOMAIN`    | A record name to update |

Public IP is fetched from ipify; record TTL is set to 120 s, `proxied: false`.

## API

The `CloudflareDNS` module (`src/CloudflareDNS.ts`) is exported from `src/index.ts` — DNS record operations via
Cloudflare API v4.

## Monorepo relationship

**Standalone** package — not a dependency of `apps/web` or `apps/service`.

## Scripts

| Script            | Description                  |
| ----------------- | ---------------------------- |
| `build`           | `tsc` + Bun bundle → `dist/` |
| `lint` / `format` | ESLint / Prettier            |
