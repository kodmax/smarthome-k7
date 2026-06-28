import { getTextContent } from '@/utils/get-text-context'

const irPattern =
  /<tr>\s*<td><a href="wibor\?rateDate=&rateChartType=..">(WIBOR ..)[<>/a-z ]+\s*<\/td>\s*<td class="[a-zA-Z -]+">\s*(-?\d+,\d+)%\s*\((-?\d+,\d+)\)/g
const datePattern = /<td>Data<\/td>\s*<td class="textBold">(\d\d\d\d-\d\d-\d\d)<\/td>/

type WiborRate = {
  period: string
  interestRate: string
  delta: string
}

type NbpRate = {
  ir: string
  date: string
}

const parseWiborFromHtml = (html: string): Record<string, { ir: string; delta: string; date: string }> => {
  const rates = [...html.matchAll(irPattern)].map(match => ({
    period: match[1],
    interestRate: match[2].replace(',', '.'),
    delta: match[3].replace(',', '.'),
  }))
  const dateMatch = html.match(datePattern)
  const date = dateMatch === null ? '' : dateMatch[1]

  return Object.fromEntries(rates.map(rate => [rate.period, { ir: rate.interestRate, delta: rate.delta, date }]))
}

const parseNbpRatesFromDocument = (document: Document): Record<string, NbpRate> => {
  return Object.fromEntries(
    Array.from(document.querySelectorAll('table.nbptable tr'))
      .map(tr => Array.from(tr.children))
      .map(([name, value, date]) => [
        getTextContent(name).trim(),
        {
          ir: getTextContent(value).trim().replace(',', '.'),
          date: getTextContent(date).trim(),
        },
      ]),
  )
}

export type { NbpRate, WiborRate }
export { datePattern, irPattern, parseNbpRatesFromDocument, parseWiborFromHtml }
