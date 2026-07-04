# @repo/assets

Shared assets for the monorepo: Lucide icon components and weather SVG icons.

## Layout

| Path              | Purpose                            |
| ----------------- | ---------------------------------- |
| `icons/lucide.ts` | App icon names → Lucide components |
| `icons/weather/`  | IMGW-style weather SVG icons (v2)  |

## Usage

```tsx
import { HomeIcon, TemperatureIcon } from '@repo/assets'

<HomeIcon size={24} />
<TemperatureIcon strokeWidth={1.5} />
```

Weather SVG icons (filename → SVG string):

```ts
import { weatherIcons } from '@repo/assets'

weatherIcons['01.svg']
```

## Icon map

| Export            | Lucide component            |
| ----------------- | --------------------------- |
| `HomeIcon`        | House                       |
| `DashboardIcon`   | LayoutDashboard             |
| `EnergyIcon`      | Zap                         |
| `ConsumptionIcon` | Activity                    |
| `PowerIcon`       | ChartNoAxesColumnIncreasing |
| `TemperatureIcon` | Thermometer                 |
| `HeatingIcon`     | Flame                       |
| `CoolingIcon`     | Snowflake                   |
| `HumidityIcon`    | Droplets                    |
| `AirQualityIcon`  | Leaf                        |
| `WindIcon`        | Wind                        |
| `WeatherIcon`     | CloudSun                    |
| `RainIcon`        | CloudRain                   |
| `SunIcon`         | Sun                         |
| `NightIcon`       | Moon                        |
| `UVIcon`          | SunMedium                   |
| `SunsetIcon`      | Sunset                      |
| `SunriseIcon`     | Sunrise                     |
| `StockMarketIcon` | ChartCandlestick            |
| `TrendUpIcon`     | TrendingUp                  |
| `TrendDownIcon`   | TrendingDown                |
| `NewsIcon`        | Newspaper                   |
| `MoviesIcon`      | Clapperboard                |
| `CameraIcon`      | Camera                      |
| `JobsIcon`        | BriefcaseBusiness           |
| `ListIcon`        | List                        |
| `SettingsIcon`    | Settings                    |
| `SecurityIcon`    | ShieldCheck                 |
| `AlertIcon`       | TriangleAlert               |
| `SuccessIcon`     | CircleCheck                 |
| `InfoIcon`        | Info                        |

## Scripts

| Script   | Description |
| -------- | ----------- |
| `format` | Prettier    |
