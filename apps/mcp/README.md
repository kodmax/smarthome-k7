# smarthome MCP server

Serwer [Model Context Protocol](https://modelcontextprotocol.io/) dla integracji smarthome z Cursor i innymi klientami
MCP.

Transport: **stdio** (proces uruchamiany lokalnie przez klienta).

## Development

```bash
# z roota monorepo
yarn workspace mcp build
yarn workspace mcp start
```

Watch TypeScript:

```bash
yarn workspace mcp watch
```

## Konfiguracja

```bash
cp apps/mcp/.env.example apps/mcp/.env
```

`SERVICE_API_URL` — adres HTTP API serwisu (feeds + komendy).

| Środowisko             | URL                     |
| ---------------------- | ----------------------- |
| dev (service lokalnie) | `http://127.0.0.1:3679` |
| prod (jak web)         | `https://<host>/api`    |

Przed pierwszym użyciem zbuduj serwer (`yarn workspace mcp build`), uruchom `apps/service` (HTTP API :3679), potem włącz
**dashboard** w **Cursor Settings → MCP**.

Narzędzia MCP (15 łącznie — dane z REST API serwisu):

| Narzędzie               | Kiedy użyć                                       |
| ----------------------- | ------------------------------------------------ |
| `ping`                  | Sprawdzenie, czy serwer MCP odpowiada            |
| `knx_temperatures`      | Temperatura w pokojach (KNX)                     |
| `home_heating`          | Ogrzewanie i tryby HVAC                          |
| `home_air_quality`      | CO₂ i wilgotność w domu                          |
| `home_energy`           | Zużycie prądu i koszty                           |
| `home_lights`           | Stan obwodów oświetlenia KNX                     |
| `control_light`         | Włącz/wyłącz obwód KNX                           |
| `outdoor_weather`       | Pogoda na zewnątrz                               |
| `stock_quote`           | Cena konkretnej akcji (symbol)                   |
| `stock_market_overview` | Ogólny przegląd giełdy                           |
| `job_offers`            | Widoczne oferty pracy                            |
| `news_headlines`        | Nagłówki wiadomości                              |
| `torrents_status`       | Torrenty + Transmission                          |
| `search_torrents`       | Wyszukiwanie torrentów po frazie (surowe wyniki) |
| `dashboard_summary`     | Wszystko naraz (rzadko)                          |

## Inspector

```bash
npx @modelcontextprotocol/inspector node apps/mcp/dist/index.js
```
