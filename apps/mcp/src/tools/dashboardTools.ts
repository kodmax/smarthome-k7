import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import * as z from 'zod'
import type {
  Co2Data,
  EnergyFeed,
  HumidityData,
  JobsFeed,
  NewsFeed,
  StockMarketFeed,
  TemperatureData,
  Torrent,
  TransmissionFeed,
  WeatherFeed,
} from '@repo/types'
import type { FeedStore } from '../feeds/FeedStore.js'
import {
  formatAirQuality,
  formatDashboardSummary,
  formatEnergy,
  formatHeating,
  formatJobs,
  formatNews,
  formatStockMarketOverview,
  formatStockQuote,
  formatTemperatures,
  formatTorrentSearchResults,
  formatTorrentsStatus,
  formatWeather,
  missingDataMessage,
} from './formatDashboard.js'
import { feedUnavailable, serviceUnavailable, textResult } from './toolHelpers.js'

export function registerDashboardTools(server: McpServer, feedStore: FeedStore): void {
  server.registerTool(
    'knx_temperatures',
    {
      title: 'Temperatury w domu (KNX)',
      description:
        'Aktualne temperatury pomieszczeń z KNX: salon, sypialnia, łazienka, podłoga łazienki. Użyj gdy pytasz o temperaturę w konkretnym pokoju.',
    },
    async () => {
      if (missingDataMessage(feedStore)) return serviceUnavailable(feedStore)
      return textResult(formatTemperatures(feedStore))
    },
  )

  server.registerTool(
    'home_heating',
    {
      title: 'Ogrzewanie (KNX)',
      description: 'Stan ogrzewania wody/podłogi i tryby HVAC (Comfort, Economy itd.) w salonie, sypialni i łazience.',
    },
    async () => {
      const feed = feedStore.get<TemperatureData>('heating')
      if (!feed) return feedUnavailable(feedStore, 'ogrzewanie')
      return textResult(formatHeating(feed))
    },
  )

  server.registerTool(
    'home_air_quality',
    {
      title: 'Jakość powietrza w domu',
      description: 'CO₂ i wilgotność w domu (czujniki KNX). Użyj przed decyzją o wietrzeniu.',
    },
    async () => {
      if (missingDataMessage(feedStore)) return serviceUnavailable(feedStore)
      return textResult(
        formatAirQuality(
          feedStore.get<Co2Data>('home.air-quality.co2'),
          feedStore.get<HumidityData>('home.air-quality.humidity'),
        ),
      )
    },
  )

  server.registerTool(
    'home_energy',
    {
      title: 'Energia elektryczna',
      description:
        'Chwilowy pobór prądu, zużycie dzienne, pomiar licznika, koszty i średnie zużycie z dashboardu energii.',
    },
    async () => {
      const feed = feedStore.get<EnergyFeed>('energy')
      if (!feed) return feedUnavailable(feedStore, 'energia')
      return textResult(formatEnergy(feed))
    },
  )

  server.registerTool(
    'outdoor_weather',
    {
      title: 'Pogoda na zewnątrz',
      description:
        'Temperatura, wiatr, wilgotność, UV, AQI i prognoza na dziś — dane z zewnętrznej stacji/pogody na dashboardzie.',
    },
    async () => {
      const feed = feedStore.get<WeatherFeed>('weather')
      if (!feed) return feedUnavailable(feedStore, 'pogoda')
      return textResult(formatWeather(feed))
    },
  )

  server.registerTool(
    'stock_quote',
    {
      title: 'Notowania akcji',
      description:
        'Cena i zmiana konkretnej akcji z watchlisty giełdowej na dashboardzie (np. MU, NVDA, AAPL). Podaj symbol tickera.',
      inputSchema: {
        symbol: z.string().describe('Symbol tickera, np. MU, NVDA, AAPL'),
      },
    },
    async ({ symbol }) => {
      const feed = feedStore.get<StockMarketFeed>('stock-market')
      if (!feed) return feedUnavailable(feedStore, 'giełda')

      const quote = formatStockQuote(feed, symbol)
      if (!quote) {
        const symbols = feed.tickers.map(ticker => ticker.symbol).join(', ')
        return textResult(`Ticker "${symbol}" nie jest na watchliście dashboardu. Dostępne: ${symbols}`)
      }

      return textResult(quote)
    },
  )

  server.registerTool(
    'stock_market_overview',
    {
      title: 'Przegląd giełdy',
      description:
        'Status rynku (otwarty/zamknięty) i wszystkie notowania z watchlisty na dashboardzie. Użyj gdy pytasz ogólnie o giełdę, nie o jedną akcję.',
    },
    async () => {
      const feed = feedStore.get<StockMarketFeed>('stock-market')
      if (!feed) return feedUnavailable(feedStore, 'giełda')
      return textResult(formatStockMarketOverview(feed))
    },
  )

  server.registerTool(
    'job_offers',
    {
      title: 'Oferty pracy',
      description:
        'Widoczne oferty pracy z dashboardu (JustJoin/NoFluff/TheProtocol) — tylko te, które nie są ukryte, tak jak na karcie Jobs.',
    },
    async () => {
      const feed = feedStore.get<JobsFeed>('jobs')
      if (!feed) return feedUnavailable(feedStore, 'oferty pracy')
      return textResult(formatJobs(feed, true))
    },
  )

  server.registerTool(
    'news_headlines',
    {
      title: 'Nagłówki wiadomości',
      description: 'Nieprzeczytane nagłówki artykułów z karty News na dashboardzie (tak jak domyślny widok karty).',
    },
    async () => {
      const feed = feedStore.get<NewsFeed>('news')
      if (!feed) return feedUnavailable(feedStore, 'wiadomości')
      return textResult(formatNews(feed))
    },
  )

  server.registerTool(
    'search_torrents',
    {
      title: 'Szukaj torrentów',
      description:
        'Wyszukuje torrenty na TPB (kategoria filmów) po frazie — tak jak wyszukiwarka na karcie dashboardu. Zwraca surową listę wyników, bez grupowania po tytułach.',
      inputSchema: {
        query: z.string().min(1).describe('Fraza wyszukiwania, np. "Spider-Man", "Project Hail Mary 1080p"'),
      },
    },
    async ({ query }) => {
      const trimmedQuery = query.trim()
      if (!trimmedQuery) {
        return textResult('Podaj niepustą frazę wyszukiwania (parametr query).')
      }

      if (!feedStore.isConnected()) {
        return textResult('Brak połączenia z Apollo WebSocket — nie można wyszukać torrentów.')
      }

      try {
        const waitForResults = feedStore.waitForFeed<Torrent[]>('top-torrents')
        feedStore.command('torrents', 'search', trimmedQuery)
        const torrents = await waitForResults
        return textResult(formatTorrentSearchResults(trimmedQuery, torrents))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'nieznany błąd'
        return textResult(`Wyszukiwanie torrentów nie powiodło się: ${message}`)
      }
    },
  )

  server.registerTool(
    'torrents_status',
    {
      title: 'Torrenty i Transmission',
      description: 'Top torrenty pogrupowane po tytułach (jak na karcie dashboardu) oraz status sesji Transmission.',
    },
    async () => {
      if (missingDataMessage(feedStore)) return serviceUnavailable(feedStore)
      return textResult(
        formatTorrentsStatus(feedStore.get<Torrent[]>('top-torrents'), feedStore.get<TransmissionFeed>('transmission')),
      )
    },
  )

  server.registerTool(
    'dashboard_summary',
    {
      title: 'Cały dashboard (skrót)',
      description:
        'Skrót wszystkich kart dashboardu naraz. Użyj tylko gdy potrzebujesz ogólnego przeglądu — w pozostałych przypadkach wybierz węższe narzędzie.',
    },
    async () => {
      const missing = missingDataMessage(feedStore)
      if (missing) return textResult(missing)
      return textResult(formatDashboardSummary(feedStore))
    },
  )
}
