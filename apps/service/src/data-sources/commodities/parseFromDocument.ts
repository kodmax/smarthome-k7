import { requireElements, withScraperSource } from '@/utils/scraper'
import { getNumberContent } from '@/utils/get-number-content'
import type { BtcPrice } from './btc'
import type { GoldPrice } from './gold'
import type { InflationData } from './inflation'
import type { OilPrice } from './oil'

type InflationRawData = Record<number, number[][]>

const parseInflationFromDocument = (document: Document): InflationData =>
  withScraperSource('inflation', () => {
    const rows = requireElements(document, 'tr', 'monthly CPI table')
    const data = rows
      .map((tr): [number, number[]] => [
        Number(tr.querySelector('th:not([rowspan])')?.textContent),
        Array.from(tr.querySelectorAll('td')).map(td => Number(td.textContent?.replace(',', '.'))),
      ])
      .filter(([year, months]) => !isNaN(year) && months.length === 12)
      .filter(([year]) => year >= 2015)

    if (data.length === 0) {
      throw new Error('no yearly rows with 12 monthly values found in monthly CPI table')
    }
    const years = new Set<number>(data.map(year => year[0]))

    const history: InflationRawData = {}
    for (const year of years) {
      history[year] = []
    }
    for (const [year, months] of data) {
      history[year].push(months)
    }

    const inflation: InflationData = []
    for (const year of Object.keys(history).sort((a, b) => +a - +b)) {
      const m2m = history[+year][1]

      const months = m2m.map((value, i) => ({
        datetime: `${year}-${Number(i + 1)
          .toString()
          .padStart(2, '0')}-22`,
        value,
      }))

      inflation.push(...months.filter(record => record.value !== 0))
    }

    return inflation.slice(-12)
  })

const parseGoldPriceFromDocument = (document: Document): GoldPrice =>
  withScraperSource('gold', () => {
    const price = getNumberContent(document, '.price-section__current-value')
    return {
      g: Number(price / 28.3495231).toFixed(2),
      oz: Number(price).toFixed(0),
    }
  })

const parseBtcPriceFromDocument = (document: Document): BtcPrice =>
  withScraperSource('btc', () => ({
    usd: getNumberContent(document, '.QuoteStrip-lastPrice').toFixed(2),
  }))

const parseOilPriceFromDocument = (document: Document): OilPrice =>
  withScraperSource('oil', () => ({
    l: (getNumberContent(document, '.QuoteStrip-lastPrice') / 159).toFixed(2),
  }))

export {
  parseBtcPriceFromDocument,
  parseGoldPriceFromDocument,
  parseInflationFromDocument,
  parseOilPriceFromDocument,
}
