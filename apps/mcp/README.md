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

`APOLLO_WS_URL` — adres WebSocket Apollo.

| Środowisko             | URL                   |
| ---------------------- | --------------------- |
| dev (service lokalnie) | `ws://127.0.0.1:3678` |
| prod (jak web)         | `wss://<host>/ws`     |

### TLS / certyfikat

MCP uruchamia Node z **`--use-system-ca`** (`.cursor/mcp.json`) — używa CA z keychaina macOS / systemu.

Jeśli root CA nie jest w systemie, dodaj go do keychaina **albo** ustaw w `.env`:

```
APOLLO_WS_CA_FILE=certs/root-ca.pem
```

Plik PEM wrzuć do `apps/mcp/certs/` (gitignored).

## Cursor

Konfiguracja jest w [`.cursor/mcp.json`](../../.cursor/mcp.json). Ścieżki używają `${workspaceFolder}`, więc działają na
każdej maszynie.

Przed pierwszym użyciem zbuduj serwer (`yarn workspace mcp build`), uruchom `apps/service` (WebSocket :3678), potem
włącz **dashboard** w **Cursor Settings → MCP**.

Narzędzia MCP (15 łącznie — cache z WebSocket Apollo):

| Narzędzie               | Kiedy użyć                                       |
| ----------------------- | ------------------------------------------------ |
| `ping`                  | Sprawdzenie, czy serwer MCP odpowiada            |
| `knx_temperatures`      | Temperatura w pokojach (KNX)                     |
| `home_heating`          | Ogrzewanie i tryby HVAC                          |
| `home_air_quality`      | CO₂ i wilgotność w domu                          |
| `home_energy`           | Zużycie prądu i koszty                           |
| `home_lights`           | Stan obwodów oświetlenia KNX                     |
| `control_light`         | Włącz/wyłącz obwód KNX (wymaga działającego WS)  |
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
