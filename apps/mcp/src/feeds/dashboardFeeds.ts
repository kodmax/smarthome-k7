export const DASHBOARD_FEEDS = [
  { id: 'weather', label: 'Pogoda' },
  { id: 'stock-market', label: 'Giełda' },
  { id: 'energy', label: 'Energia' },
  { id: 'heating', label: 'Ogrzewanie' },
  { id: 'home.temp.bathroom-floor', label: 'Temperatura — podłoga łazienki' },
  { id: 'home.temp.livingroom', label: 'Temperatura — salon' },
  { id: 'home.temp.bedroom', label: 'Temperatura — sypialnia' },
  { id: 'home.temp.bathroom', label: 'Temperatura — łazienka' },
  { id: 'home.air-quality.co2', label: 'CO₂' },
  { id: 'home.air-quality.humidity', label: 'Wilgotność' },
  { id: 'news', label: 'Wiadomości' },
  { id: 'jobs', label: 'Oferty pracy' },
  { id: 'top-torrents', label: 'Top torrenty' },
  { id: 'transmission', label: 'Transmission' },
] as const

export type DashboardFeedId = (typeof DASHBOARD_FEEDS)[number]['id']

export const DASHBOARD_FEED_IDS: DashboardFeedId[] = DASHBOARD_FEEDS.map(feed => feed.id)

export function dashboardFeedLabel(feedId: string): string {
  return DASHBOARD_FEEDS.find(feed => feed.id === feedId)?.label ?? feedId
}
