# @repo/apollo-card

Zoomable dashboard card shell for the smart home UI — header, content area, optional zoom curtain, and status bar.

## API

| Export                                           | Description                                    |
| ------------------------------------------------ | ---------------------------------------------- |
| `ApolloCard`                                     | Card container with title, icon, zoom, actions |
| `ApolloCardAction`                               | Icon button for card header actions            |
| `ZoomStateProvider`                              | Context for coordinating zoom across cards     |
| `useZoom`                                        | Hook for zoom state on a card                  |
| `apolloCardContentHeight`, `apolloCardRowHeight` | Layout helpers for card grid                   |

```tsx
import { ApolloCard } from '@repo/apollo-card'
import { WeatherIcon } from '@repo/assets'
;<ApolloCard title='Weather' icon={WeatherIcon} cardId='weather'>
  ...
</ApolloCard>
```

## Usage

Consumed exclusively by [`apps/web`](../../apps/web) — dashboard cards in `src/pages/Dashboard/cards/`.

The package exports TypeScript source with no separate build step — Vite compiles it together with the web app.

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `test`            | Vitest            |
| `lint` / `format` | ESLint / Prettier |
