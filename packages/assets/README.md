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

| Export               | Lucide component            |
| -------------------- | --------------------------- |
| `HomeIcon`           | House                       |
| `DashboardIcon`      | LayoutDashboard             |
| `EnergyIcon`         | Zap                         |
| `ConsumptionIcon`    | Activity                    |
| `PowerIcon`          | ChartNoAxesColumnIncreasing |
| `TemperatureIcon`    | Thermometer                 |
| `ThermometerSunIcon` | ThermometerSun              |
| `AirVentIcon`        | AirVent                     |
| `HeatingIcon`        | Flame                       |
| `HeaterIcon`         | Heater                      |
| `CoolingIcon`        | Snowflake                   |
| `FanIcon`            | Fan                         |
| `HumidityIcon`       | Droplets                    |
| `AirQualityIcon`     | Leaf                        |
| `WindIcon`           | Wind                        |
| `WeatherIcon`        | CloudSun                    |
| `RainIcon`           | CloudRain                   |
| `SnowIcon`           | CloudSnow                   |
| `HailIcon`           | CloudHail                   |
| `SleetIcon`          | CloudDrizzle                |
| `MixedPrecipIcon`    | CloudRainWind               |
| `SunIcon`            | Sun                         |
| `NightIcon`          | Moon                        |
| `UVIcon`             | SunMedium                   |
| `SunsetIcon`         | Sunset                      |
| `SunriseIcon`        | Sunrise                     |
| `StockMarketIcon`    | ChartCandlestick            |
| `TrendUpIcon`        | TrendingUp                  |
| `TrendDownIcon`      | TrendingDown                |
| `NewsIcon`           | Newspaper                   |
| `MoviesIcon`         | Clapperboard                |
| `CameraIcon`         | Camera                      |
| `JobsIcon`           | BriefcaseBusiness           |
| `ListIcon`           | List                        |
| `FilterIcon`         | Funnel                      |
| `FilterOffIcon`      | FunnelX                     |
| `SettingsIcon`       | Cog                         |
| `SunMoonIcon`        | SunMoon                     |
| `SecurityIcon`       | ShieldCheck                 |
| `AlertIcon`          | TriangleAlert               |
| `SuccessIcon`        | CircleCheck                 |
| `InfoIcon`           | Info                        |
| `IconLink`           | Link                        |
| `IconCopy`           | Copy                        |
| `FavStarIcon`        | Star                        |
| `BackIcon`           | ChevronLeft                 |
| `ChevronRightIcon`   | ChevronRight                |
| `CollapseMenuIcon`   | ChevronsLeft                |
| `ExpandMenuIcon`     | ChevronsRight               |
| `MenuIcon`           | Menu                        |

## Scripts

| Script   | Description |
| -------- | ----------- |
| `format` | Prettier    |
