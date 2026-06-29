# web

Smart home dashboard frontend — a grid of live data cards (weather, energy, heating, air quality, stock market, news,
jobs, torrents).

## Stack

- React 18, Vite, TypeScript
- MUI + Emotion
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

| Variable             | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `VITE_WEBSOCKET_URL` | Backend WebSocket URL (defaults to `ws://<hostname>:3678`) |

The backend (`apps/service`) must be running for cards to receive data.

## Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `dev`             | Vite dev server          |
| `build`           | `tsc` + production build |
| `preview`         | Preview production build |
| `test`            | Vitest (single run)      |
| `test:watch`      | Vitest in watch mode     |
| `lint` / `format` | ESLint / Prettier        |

## Monorepo dependencies

| Package                                          | Role                                    |
| ------------------------------------------------ | --------------------------------------- |
| `@repo/feed-client`                              | `useFeed`, `useCommand`, `refreshFeeds` |
| `@repo/types`                                    | Feed payload types                      |
| `@repo/weather-icons`                            | Weather icons in forecast cards         |
| `@repo/eslint-config`, `@repo/typescript-config` | Tooling                                 |

Cards in `src/cards/` map WebSocket topics to UI components. App entry point: `src/main.tsx`.
