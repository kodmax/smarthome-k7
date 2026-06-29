# @repo/weather-icons

IMGW-style weather SVG icons as a `Record<string, string>` (filename → SVG content).

## Usage

```ts
import { icons } from '@repo/weather-icons'

// icons['01d'] — SVG as a string
```

Consumer: [`apps/web`](../../apps/web) — `WeatherForecast`, `HourlyWeatherForecast`, `DayLarge`, `DaySmall` cards.

Entry point: `v2/index.ts`. Static assets only — no runtime build step.

## Scripts

| Script | Description |
|--------|-------------|
| `format` | Prettier |
