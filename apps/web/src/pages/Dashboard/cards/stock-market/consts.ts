import { MarketStatus } from '@repo/types'

export const marketStatusTitles: Record<MarketStatus, string> = {
  'After-Hours': 'Po zamknięciu',
  'Pre-Market': 'Przed otwarciem',
  Closed: 'Rynek zamknięty',
  Open: 'Rynek otwarty',
}
