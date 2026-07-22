# @repo/apollo-card

Zoomable dashboard card shell for the smart home UI — header, content area, optional zoom curtain, and status bar.

## API

| Export                                           | Description                                                     |
| ------------------------------------------------ | --------------------------------------------------------------- |
| `BaseCard`                                       | Card container with title, icon, zoom, `actions`, `zoomActions` |
| `SingleValueCard`                                | Compact 3-line metric card built on `BaseCard`                  |
| `ApolloCardAction`                               | Icon button for card header actions                             |
| `ZoomStateProvider`                              | Context for coordinating zoom across cards                      |
| `useZoom`                                        | Hook for zoom state on a card                                   |
| `apolloCardContentHeight`, `apolloCardRowHeight` | Layout helpers for card grid                                    |

```tsx
import { BaseCard } from '@repo/apollo-card'
import { WeatherIcon } from '@repo/assets'
;<BaseCard title='Weather' icon={WeatherIcon} cardId='weather'>
  ...
</BaseCard>
```

`actions` render in the header at all times. `zoomActions` render only while the card is zoomed.

## Usage

Consumed exclusively by [`apps/web`](../../apps/web) — dashboard cards in `src/pages/Dashboard/cards/`.

The package exports TypeScript source with no separate build step — Vite compiles it together with the web app.

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `test`            | Vitest            |
| `lint` / `format` | ESLint / Prettier |
