import { EPSForecast, TrailingEPS } from '@repo/types'

export type NasdaqEPSData = {
  forecast: EPSForecast[]
  ttm: TrailingEPS[]
  ticker: string
}
