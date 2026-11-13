# web

Smart home dashboard frontend — a grid of live data cards (weather, energy, heating, air quality, stock market, news,
job-ads, torrents).

## Stack

- React 18, Vite, TypeScript
- MUI v7 (Material 3 color system, CSS variables, light/dark schemes) + Emotion
- Vitest + Testing Library

## Running

```sh
# from monorepo root
yarn workspace web dev

# or
yarn dev   # together with apps/service
```

The dev server listens on `--host` by default (accessible on the local network).

## Environment variables

| Variable                | Description                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `VITE_BACKEND_BASE_URL` | Backend origin for WebSocket (`/ws`) and HTTP API (`/api`); defaults to page origin |

The backend (`apps/service`) must be running for cards to receive data.

## PWA icons

Generate favicon and PWA icons from a source image:

```sh
yarn workspace web icons:generate ikonka.PNG
yarn workspace web icons:generate ikonka.PNG 90
```

- `90` means use the center 90% of the image (5% trimmed from each side)
- Output files are written to `public/pwa/` with a content hash in the filename
- `src/generated/pwa-icons.json` is updated for Vite, HTML, and the web manifest

Run this after changing the source icon, then rebuild/deploy.

## Scripts

| Script            | Description                                   |
| ----------------- | --------------------------------------------- |
| `dev`             | Vite dev server                               |
| `build`           | `tsc` + production build                      |
| `preview`         | Preview production build                      |
| `icons:generate`  | Generate hashed PWA icons from a source image |
| `test`            | Vitest (single run)                           |
| `test:watch`      | Vitest in watch mode                          |
| `lint` / `format` | ESLint / Prettier                             |

## Monorepo dependencies

| Package                                          | Role                                   |
| ------------------------------------------------ | -------------------------------------- |
| `@repo/apollo-card`                              | Zoomable dashboard card shell          |
| `@repo/feed-client`                              | `useFeed`, `useCommand`                |
| `@repo/types`                                    | Feed payload types                     |
| `@repo/assets`                                   | Lucide icons and weather SVGs in cards |
| `@repo/design-tokens`                            | Shared MUI theme                       |
| `@repo/i18n`                                     | Shared translations and locale helpers |
| `@repo/eslint-config`, `@repo/typescript-config` | Tooling                                |

Cards in `src/pages/Dashboard/cards/` map WebSocket topics to UI components. App entry point: `src/main.tsx`.

## Theming

The dashboard supports **dark and light** themes via `@repo/design-tokens`. By default it follows the OS preference
(`defaultMode='system'` in `src/main.tsx`). Use `theme.vars.palette.*` in styled components for scheme-aware colors.
Tests pin `defaultMode='dark'` for stable snapshots.

## WebMCP

The app exposes 16 browser-native tools through `document.modelContext.registerTool()` when the browser supports it. An
agent needs WebMCP integration and an open K7 tab to discover and invoke them. This experimental API may require browser
flags or an origin trial; see the
[Chrome guide](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools). Browsers
without the API continue to work normally. No polyfill, extra server, or dependency on `apps/mcp` is required.

Implementation: `src/webmcp/`. Tools register while the app layout is online and unregister on unmount or offline
transition. Cleanup also cancels outstanding requests. Requests use the same API base URL as the dashboard, including
`VITE_BACKEND_BASE_URL`, and the browser's normal fetch authentication behavior.

Available tools: `ping`, `knx_temperatures`, `home_heating`, `home_air_quality`, `home_energy`, `outdoor_weather`,
`stock_quote`, `stock_market_overview`, `job_offers`, `news_headlines`, `torrents_status`, `search_torrents`,
`download_torrent`, `home_lights`, `control_light`, and `dashboard_summary`.

Tools return structured JSON rather than the text formatting of the standalone MCP server. Combined feed results include
per-feed errors when a source is unavailable. `ping` checks the page integration only. Torrent search updates the
dashboard results but does not download anything. Light commands validate the circuit against the current feed and poll
for confirmation for up to 20 seconds; a timeout does not mean that the command was not sent.

Validation: `yarn workspace web test src/webmcp/webmcp.test.ts`. Tests use mocked HTTP responses and a fake browser
registration interface, so they do not operate real devices. To check native discovery, open K7 in a WebMCP-enabled
browser and inspect its registered tools using the browser's WebMCP tooling, then call a read-only tool first.
