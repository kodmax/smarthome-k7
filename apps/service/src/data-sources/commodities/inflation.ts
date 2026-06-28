import { fetchDocument } from '@/fetch'
import { parseInflationFromDocument } from './parseFromDocument'

// eslint-disable-next-line max-len
const inflationDataUrl =
  'https://stat.gov.pl/obszary-tematyczne/ceny-handel/wskazniki-cen/wskazniki-cen-towarow-i-uslug-konsumpcyjnych-pot-inflacja-/miesieczne-wskazniki-cen-towarow-i-uslug-konsumpcyjnych-od-1982-roku/'

type InflationData = Array<{
  datetime: string
  value: number
}>

const fetchInflationData = async (): Promise<InflationData> => {
  return parseInflationFromDocument(await fetchDocument(inflationDataUrl, { accept: 'text/html' }))
}

export type { InflationData }
export { fetchInflationData }
