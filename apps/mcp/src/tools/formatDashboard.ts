import type {
  Co2Data,
  EnergyFeed,
  HomeTempFeedData,
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
import { DASHBOARD_FEED_IDS, type DashboardFeedId } from '../feeds/dashboardFeeds.js'
import { getTopTitles } from '../torrents/getTopTitles.js'

const TEMPERATURE_FEEDS: Array<{ id: DashboardFeedId; label: string }> = [
  { id: 'home.temp.bathroom-floor', label: 'Podłoga łazienki' },
  { id: 'home.temp.livingroom', label: 'Salon' },
  { id: 'home.temp.bedroom', label: 'Sypialnia' },
  { id: 'home.temp.bathroom', label: 'Łazienka' },
]

function formatTemperature(feed: HomeTempFeedData): string {
  const current = `${feed.reading.value.toFixed(1)} °C`
  if (feed.setpoint === undefined) return current
  return `${current} (cel: ${feed.setpoint} °C)`
}

export function formatTemperatures(feedStore: FeedStore): string {
  return TEMPERATURE_FEEDS.map(({ id, label }) => {
    const feed = feedStore.get<HomeTempFeedData>(id)
    if (!feed) return `${label}: brak danych`
    return `${label}: ${formatTemperature(feed)}`
  }).join('\n')
}

function heatingOn(reading: { value: number; text?: string }): string {
  return reading.value === 1 ? 'włączone' : 'wyłączone'
}

export function formatHeating(feed: TemperatureData): string {
  const lines = [
    `Salon: ${heatingOn(feed.status.salon)} (${feed.mode.livingroom.text})`,
    `Sypialnia: ${heatingOn(feed.status.sypialnia)} (${feed.mode.bedroom.text})`,
    `Łazienka: ${heatingOn(feed.status.lazienka)} (${feed.mode.bathroom.text})`,
    `Podłoga łazienki: ${heatingOn(feed.status.lazienkaPodloga)}`,
  ]
  return lines.join('\n')
}

export function formatAirQuality(co2: Co2Data | undefined, humidity: HumidityData | undefined): string {
  const lines: string[] = []

  if (co2) {
    lines.push(`CO₂: ${co2.reading.value.toFixed(0)} ppm`)
  } else {
    lines.push('CO₂: brak danych')
  }

  if (humidity) {
    lines.push(`Wilgotność: ${humidity.reading.value.toFixed(0)}%`)
  } else {
    lines.push('Wilgotność: brak danych')
  }

  return lines.join('\n')
}

function formatReadingValue(value: number, unit: string, fractionDigits = 2): string {
  const formatted = value.toLocaleString('pl-PL', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits > 0 ? 0 : undefined,
  })
  return `${formatted} ${unit}`
}

export function formatEnergy(feed: EnergyFeed): string {
  const { instant, daily, meter, cost } = feed
  const grossPrice = (cost.rates.distribution + cost.rates.energy) * cost.rates.vat
  const meterCost = (meter.reading.value / 1000) * grossPrice
  const avgDailyConsumption = cost.avg / 1000
  const avgMonthlyConsumption = (cost.avg * 30) / 1000
  const avgMonthlyCost =
    (avgMonthlyConsumption * (cost.rates.distribution + cost.rates.energy) + cost.rates.added) * cost.rates.vat

  return [
    `Chwilowy pobór: ${formatReadingValue(instant.reading.value, instant.reading.unit ?? 'W', 0)}`,
    `Zużycie dziś: ${formatReadingValue(daily.reading.value, daily.reading.unit ?? 'kWh')}`,
    `Pomiar licznika: ${formatReadingValue(meter.reading.value, meter.reading.unit ?? 'Wh', 0)}`,
    `Koszt licznika: ${meterCost.toFixed(2)} PLN`,
    `Śr. zużycie dzienne: ${formatReadingValue(avgDailyConsumption, 'kWh', 1)}`,
    `Śr. zużycie miesięczne: ${formatReadingValue(avgMonthlyConsumption, 'kWh', 0)}`,
    `Śr. koszt miesięczny: ${avgMonthlyCost.toFixed(0)} PLN`,
    `Cena brutto: ${grossPrice.toFixed(4)} PLN/kWh`,
  ].join('\n')
}

export function formatWeather(feed: WeatherFeed): string {
  const { instant, sunTimes, aq } = feed
  const lines = [
    `Temperatura: ${instant.temp.toFixed(1)} °C`,
    `Wilgotność: ${instant.humidity}%`,
    `Wiatr: ${instant.wind.speed.toFixed(0)} km/h ${instant.wind.direction}`,
    `UV: ${instant.uv}`,
    `AQI: ${aq.aqi}`,
    `Wschód: ${sunTimes.sunrise}, zachód: ${sunTimes.sunset}`,
  ]

  if (feed.forecast[0]) {
    const today = feed.forecast[0]
    lines.push(`Dziś: ${today.temp.low}–${today.temp.high} °C`)
  }

  return lines.join('\n')
}

export function formatStockMarketOverview(feed: StockMarketFeed): string {
  const header = `Rynek: ${feed.marketInfo.status} (${feed.marketInfo.country})`
  const tickers = feed.tickers
    .map(
      ticker =>
        `${ticker.symbol}: ${ticker.price.lastTradePrice.toFixed(2)} (${ticker.price.percentageChange >= 0 ? '+' : ''}${ticker.price.percentageChange.toFixed(2)}%)`,
    )
    .join('\n')

  return `${header}\n${tickers}`
}

export function formatNews(feed: NewsFeed): string {
  const articles = feed.articles.filter(article => !article.read)

  if (articles.length === 0) return 'Brak nieprzeczytanych artykułów'

  return articles.map(article => `- ${article.title}`).join('\n')
}

export function formatJobs(feed: JobsFeed, visibleOnly = true): string {
  const ads = visibleOnly ? feed.ads.filter(ad => !ad.hide) : feed.ads

  if (ads.length === 0) {
    return visibleOnly ? 'Brak widocznych ofert (wszystkie ukryte lub brak ogłoszeń)' : 'Brak ofert'
  }

  const header = visibleOnly ? `Widocznych ofert: ${ads.length}` : `Ofert: ${ads.length}`
  const items = ads
    .map(ad => {
      const flags = [ad.applied ? 'applied' : null, ad.fav ? '★' : null, ad.workplaceType, ad.employmentType]
        .filter(Boolean)
        .join(', ')
      const salary = ad.monthlySalaryRangeAfterTaxes
        ? `${ad.monthlySalaryRangeAfterTaxes.from}–${ad.monthlySalaryRangeAfterTaxes.to} PLN netto`
        : 'brak widełek'
      return `- ${ad.title} @ ${ad.companyName} (${flags}) — ${salary}`
    })
    .join('\n')

  return `${header}\n${items}`
}

export function formatStockQuote(feed: StockMarketFeed, symbol: string): string | null {
  const ticker = feed.tickers.find(entry => entry.symbol.toUpperCase() === symbol.toUpperCase())
  if (!ticker) return null

  const { price } = ticker
  return [
    `${ticker.symbol} — ${ticker.title}`,
    `Cena: ${price.lastTradePrice.toFixed(2)} USD (${price.netChange >= 0 ? '+' : ''}${price.netChange.toFixed(2)}, ${price.percentageChange >= 0 ? '+' : ''}${price.percentageChange.toFixed(2)}%)`,
    `Ostatni trade: ${price.lastTradeTimestamp}`,
    `Cel analityków: ${price.priceTarget ?? 'brak'}`,
    `EPS (trailing): ${ticker.statistics.trailingEPS}`,
  ].join('\n')
}

function formatBytes(size: string): string {
  const bytes = Number(size)
  if (!Number.isFinite(bytes)) return size
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

function isEmptyTorrentSearchResult(torrents: Torrent[]): boolean {
  return torrents.length === 0 || (torrents.length === 1 && torrents[0]?.id === '0')
}

export function formatTorrentSearchResults(query: string, torrents: Torrent[]): string {
  if (isEmptyTorrentSearchResult(torrents)) {
    return `Brak wyników dla: "${query}"`
  }

  const header = `Wyniki dla "${query}": ${torrents.length}`
  const items = torrents
    .map(torrent => {
      const details = [
        formatBytes(torrent.size),
        `S:${torrent.seeders}`,
        `L:${torrent.leechers}`,
        torrent.imdb ? `imdb: ${torrent.imdb}` : null,
      ]
        .filter(Boolean)
        .join(', ')
      return `- ${torrent.name} (${details})`
    })
    .join('\n')

  return `${header}\n${items}`
}

function formatTopTitleLine({
  title,
  imdb,
  variants,
}: {
  title: string
  imdb: string | null
  variants: number
}): string {
  const details = [variants > 1 ? `${variants} warianty` : null, imdb ? `imdb: ${imdb}` : null]
    .filter(Boolean)
    .join(', ')

  return details.length > 0 ? `- ${title} (${details})` : `- ${title}`
}

export function formatTorrents(torrents: Torrent[]): string {
  if (torrents.length === 0) return 'Brak torrentów'

  return getTopTitles(torrents).map(formatTopTitleLine).join('\n')
}

export function formatTransmission(feed: TransmissionFeed): string {
  const { sessionStats } = feed
  const down = (sessionStats.downloadSpeed / 1024).toFixed(0)
  const up = (sessionStats.uploadSpeed / 1024).toFixed(0)
  return `Torrentów: ${sessionStats.torrentCount}, ↓ ${down} KB/s, ↑ ${up} KB/s`
}

function section(title: string, body: string): string {
  return `## ${title}\n${body}`
}

export function formatDashboardSummary(feedStore: FeedStore): string {
  const sections: string[] = []

  sections.push(section('Temperatury', formatTemperatures(feedStore)))

  const heating = feedStore.get<TemperatureData>('heating')
  sections.push(section('Ogrzewanie', heating ? formatHeating(heating) : 'brak danych'))

  sections.push(
    section(
      'Powietrze w domu',
      formatAirQuality(
        feedStore.get<Co2Data>('home.air-quality.co2'),
        feedStore.get<HumidityData>('home.air-quality.humidity'),
      ),
    ),
  )

  const energy = feedStore.get<EnergyFeed>('energy')
  sections.push(section('Energia', energy ? formatEnergy(energy) : 'brak danych'))

  const weather = feedStore.get<WeatherFeed>('weather')
  sections.push(section('Pogoda', weather ? formatWeather(weather) : 'brak danych'))

  const stockMarket = feedStore.get<StockMarketFeed>('stock-market')
  sections.push(section('Giełda', stockMarket ? formatStockMarketOverview(stockMarket) : 'brak danych'))

  const news = feedStore.get<NewsFeed>('news')
  sections.push(section('Wiadomości', news ? formatNews(news) : 'brak danych'))

  const jobs = feedStore.get<JobsFeed>('jobs')
  sections.push(section('Oferty pracy', jobs ? formatJobs(jobs, true) : 'brak danych'))

  const torrents = feedStore.get<Torrent[]>('top-torrents')
  sections.push(section('Top torrenty', torrents ? formatTorrents(torrents) : 'brak danych'))

  const transmission = feedStore.get<TransmissionFeed>('transmission')
  sections.push(section('Transmission', transmission ? formatTransmission(transmission) : 'brak danych'))

  return sections.join('\n\n')
}

export function formatTorrentsStatus(
  torrents: Torrent[] | undefined,
  transmission: TransmissionFeed | undefined,
): string {
  const lines: string[] = []

  if (transmission) {
    lines.push(formatTransmission(transmission))
  } else {
    lines.push('Transmission: brak danych')
  }

  lines.push('')
  lines.push(torrents ? formatTorrents(torrents) : 'Top torrenty: brak danych')

  return lines.join('\n')
}

export function countCachedFeeds(feedStore: FeedStore): number {
  return DASHBOARD_FEED_IDS.filter(id => feedStore.get(id) !== undefined).length
}

export function missingDataMessage(feedStore: FeedStore): string | null {
  if (countCachedFeeds(feedStore) > 0) return null

  const status = feedStore.isConnected() ? 'połączony, czekam na FEED' : 'brak połączenia z Apollo'
  return `Brak danych dashboardu (${status}). Czy apps/service działa?`
}
