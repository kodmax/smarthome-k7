import {
  isArchivedApplyStatus,
  type JobAdsFeed,
  type LightsFeed,
  type NewsFeed,
  type StockMarketFeed,
} from '@repo/types'
import { command, delay, readFeed, readFeeds } from './api'
import type { WebTool } from './types'

const temperatures = ['home.temp.bathroom-floor', 'home.temp.livingroom', 'home.temp.bedroom', 'home.temp.bathroom']
const airQuality = ['home.air-quality.co2', 'home.air-quality.humidity']
const allFeeds = [
  'weather',
  'stock-market',
  'fx-rates',
  'energy',
  'heating',
  ...temperatures,
  ...airQuality,
  'news',
  'job-ads',
  'top-torrents',
  'transmission',
  'home.lights',
]
const rooms = ['living_room', 'kitchen', 'bathroom', 'bedroom', 'dining_room', 'hallway']
const stringParam = (description: string) => ({ type: 'string', minLength: 1, description })

function text(input: Record<string, unknown>, key: string): string {
  const value = input[key]
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Parameter ${key} must be a non-empty string`)
  return value.trim()
}

function tool(
  name: string,
  description: string,
  execute: WebTool['execute'],
  properties: Record<string, unknown> = {},
  required: string[] = [],
  readOnly = true,
  untrustedContent = false,
): WebTool {
  return {
    name,
    description,
    inputSchema: { type: 'object', properties, required, additionalProperties: false },
    annotations: { readOnlyHint: readOnly, untrustedContentHint: untrustedContent },
    async execute(input, options) {
      try {
        options.signal.throwIfAborted()
        if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an object')
        for (const key of Object.keys(input)) {
          if (!Object.hasOwn(properties, key)) throw new Error(`Unknown parameter: ${key}`)
        }
        return await execute(input, options)
      } catch (error) {
        options.signal.throwIfAborted()
        return { error: error instanceof Error ? error.message : 'Tool execution failed' }
      }
    },
  }
}

export function createTools(): WebTool[] {
  return [
    tool('ping', 'Sprawdź dostępność WebMCP na otwartej stronie K7. Nie sprawdza backendu.', async () => ({
      status: 'ok',
    })),
    tool('knx_temperatures', 'Aktualne temperatury pomieszczeń i podłogi łazienki z KNX.', async (_, { signal }) =>
      readFeeds(temperatures, signal),
    ),
    tool('home_heating', 'Stan ogrzewania i tryby HVAC w domu.', async (_, { signal }) => readFeed('heating', signal)),
    tool('home_air_quality', 'CO₂ i wilgotność w domu. Użyj przed decyzją o wietrzeniu.', async (_, { signal }) =>
      readFeeds(airQuality, signal),
    ),
    tool('home_energy', 'Pobór prądu, zużycie i koszty energii z dashboardu.', async (_, { signal }) =>
      readFeed('energy', signal),
    ),
    tool('outdoor_weather', 'Pogoda na zewnątrz i prognoza z dashboardu.', async (_, { signal }) =>
      readFeed('weather', signal),
    ),
    tool('stock_market_overview', 'Status rynku i wszystkie notowania z watchlisty.', async (_, { signal }) =>
      readFeed('stock-market', signal),
    ),
    tool(
      'stock_quote',
      'Notowanie jednej akcji z watchlisty dashboardu.',
      async (input, { signal }) => {
        const symbol = text(input, 'symbol').toUpperCase()
        const feed = await readFeed<StockMarketFeed>('stock-market', signal)
        return (
          feed.tickers.find(ticker => ticker.symbol.toUpperCase() === symbol) ?? {
            error: 'Ticker not on watchlist',
            availableSymbols: feed.tickers.map(ticker => ticker.symbol),
          }
        )
      },
      { symbol: stringParam('Symbol tickera, np. NVDA') },
      ['symbol'],
    ),
    tool(
      'job_offers',
      'Aktywne oferty pracy z dashboardu, bez ofert z zakończonym statusem aplikacji.',
      async (_, { signal }) => {
        const feed = await readFeed<JobAdsFeed>('job-ads', signal)
        return { ...feed, ads: feed.ads.filter(ad => !isArchivedApplyStatus(ad.meta.application.status)) }
      },
      {},
      [],
      true,
      true,
    ),
    tool(
      'news_headlines',
      'Nieprzeczytane nagłówki wiadomości z dashboardu.',
      async (_, { signal }) => {
        const feed = await readFeed<NewsFeed>('news', signal)
        return { articles: feed.articles.filter(article => !article.read) }
      },
      {},
      [],
      true,
      true,
    ),
    tool(
      'torrents_status',
      'Surowa lista torrentów z dashboardu i status Transmission.',
      async (_, { signal }) => readFeeds(['top-torrents', 'transmission'], signal),
      {},
      [],
      true,
      true,
    ),
    tool(
      'search_torrents',
      'Wyszukaj torrenty po frazie. Aktualizuje wyniki wyszukiwania na dashboardzie; nie rozpoczyna pobierania.',
      async (input, { signal }) => {
        const query = text(input, 'query')
        await command('torrents', 'search', query, signal)
        return { query, results: await readFeed('top-torrents', signal) }
      },
      { query: stringParam('Fraza wyszukiwania') },
      ['query'],
      false,
      true,
    ),
    tool(
      'download_torrent',
      'Zleć pobieranie wybranego torrenta w Transmission. Użyj linku magnet z search_torrents lub torrents_status. Wynik potwierdza przyjęcie komendy, a nie zakończenie pobierania; status sprawdź przez torrents_status.',
      async (input, { signal }) => {
        const magnetLink = text(input, 'magnetLink')
        let magnet: URL
        try {
          magnet = new URL(magnetLink)
        } catch {
          throw new Error('Expected a valid magnet link')
        }
        const validHash = magnet.searchParams
          .getAll('xt')
          .some(
            topic =>
              /^urn:btih:([a-f0-9]{40}|[a-z2-7]{32})$/i.test(topic) || /^urn:btmh:1220[a-f0-9]{64}$/i.test(topic),
          )
        if (magnet.protocol !== 'magnet:' || !validHash) {
          throw new Error('Expected a magnet link with a valid BitTorrent info hash (xt)')
        }
        await command('transmission', 'download', magnetLink, signal)
        return {
          status: 'command_accepted',
          magnetLink,
          message: 'Download requested. Check torrents_status for progress.',
        }
      },
      { magnetLink: stringParam('Link magnet wybranego torrenta') },
      ['magnetLink'],
      false,
    ),
    tool(
      'home_lights',
      'Stan obwodów oświetlenia KNX z identyfikatorami do control_light. Można ograniczyć do pokoju.',
      async (input, { signal }) => {
        const room = input.room === undefined ? undefined : text(input, 'room')
        if (room !== undefined && !rooms.includes(room)) throw new Error(`Unknown room. Available: ${rooms.join(', ')}`)
        const feed = await readFeed<LightsFeed>('home.lights', signal)
        return {
          circuits: Object.fromEntries(
            Object.entries(feed.circuits).filter(([id]) => room === undefined || id.startsWith(`${room}_`)),
          ),
        }
      },
      { room: { type: 'string', enum: rooms, description: 'Pokój' } },
    ),
    tool(
      'control_light',
      'Włącz lub wyłącz obwód KNX. Najpierw użyj home_lights, aby poznać identyfikatory. Sukces wymaga potwierdzenia odczytem stanu.',
      async (input, { signal }) => {
        const circuit = text(input, 'circuit')
        const state = text(input, 'state')
        if (state !== 'on' && state !== 'off') throw new Error('State must be on or off')
        const before = await readFeed<LightsFeed>('home.lights', signal)
        if (!Object.hasOwn(before.circuits, circuit))
          return { error: 'Unknown circuit', availableCircuits: Object.keys(before.circuits) }
        await command('lights', 'set', { circuitId: circuit, state }, signal)
        const deadline = Date.now() + 20_000
        while (Date.now() < deadline) {
          await delay(500, signal)
          const feed = await readFeed<LightsFeed>('home.lights', signal)
          if (feed.circuits[circuit]?.reading.value === (state === 'on' ? 1 : 0))
            return { circuit, state, confirmed: true, reading: feed.circuits[circuit].reading }
        }
        return {
          circuit,
          state,
          confirmed: false,
          error: 'Command sent, but state was not confirmed within 20 seconds. Read home_lights before retrying.',
        }
      },
      { circuit: stringParam('ID obwodu z home_lights'), state: { type: 'string', enum: ['on', 'off'] } },
      ['circuit', 'state'],
      false,
    ),
    tool(
      'dashboard_summary',
      'Dane wszystkich kart dashboardu. Używaj do ogólnego przeglądu; dla konkretnych pytań wybieraj węższe narzędzia. Niedostępne źródła mają pole error.',
      async (_, { signal }) => readFeeds(allFeeds, signal),
      {},
      [],
      true,
      true,
    ),
  ]
}
