import { myFetch } from '../../fetch'
import { parseHTML } from 'linkedom'

// eslint-disable-next-line max-len
const inflationDataUrl =
  'https://stat.gov.pl/obszary-tematyczne/ceny-handel/wskazniki-cen/wskazniki-cen-towarow-i-uslug-konsumpcyjnych-pot-inflacja-/miesieczne-wskazniki-cen-towarow-i-uslug-konsumpcyjnych-od-1982-roku/'
type InflationRawData = Record<number, number[][]>

type InflationData = Array<{
  datetime: string
  value: number
}>

const fetchInflationData = async (): Promise<InflationData> => {
  return myFetch(inflationDataUrl, { accept: 'text/html' })
    .then(response => response.toString())
    .then(html => {
      const document = parseHTML(html).window.document

      const data = Array.from(document.querySelectorAll('tr'))
        .map((tr): [number, number[]] => [
          Number(tr.querySelector('th:not([rowspan])')?.textContent),
          Array.from(tr.querySelectorAll('td')).map(td => Number(td.textContent?.replace(',', '.'))),
        ])
        .filter(([year, months]) => !isNaN(year) && months.length === 12)
        .filter(([year]) => year >= 2015)
      const years = new Set<number>(data.map(year => year[0]))

      const history: InflationRawData = {}
      for (const year of years) {
        history[year] = []
      }
      for (const [year, months] of data) {
        history[year].push(months)
      }

      return history
    })
    .then(inflationData => {
      const inflation: InflationData = []
      for (const year of Object.keys(inflationData).sort((a, b) => +a - +b)) {
        const m2m = inflationData[+year][1] // delta month to month, not year to year

        const months = m2m.map((value, i) => {
          return {
            datetime: `${year}-${Number(i + 1)
              .toString()
              .padStart(2, '0')}-22`,
            value,
          }
        })

        inflation.push(...months.filter(record => record.value !== 0))
      }

      return inflation.slice(-12)
    })
}

export type { InflationData }
export { fetchInflationData }
