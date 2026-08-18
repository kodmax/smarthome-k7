export type NbpTableACurrency = 'USD' | 'EUR' | 'GBP'

export type NbpTableARates = Record<NbpTableACurrency, number>

type NbpRateResponse = {
  rates: Array<{ mid: number; effectiveDate: string }>
}

const NBP_TABLE_A_CURRENCIES: NbpTableACurrency[] = ['USD', 'EUR', 'GBP']
const MAX_LOOKBACK_DAYS = 7

function formatNbpDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

async function fetchNbpRateForDate(currency: NbpTableACurrency, date: string): Promise<number | null> {
  const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currency.toLowerCase()}/${date}/?format=json`
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`NBP API request failed for ${currency}: HTTP ${response.status}`)
  }

  const body = (await response.json()) as NbpRateResponse
  const mid = body.rates[0]?.mid
  return mid ?? null
}

async function fetchLatestNbpRate(currency: NbpTableACurrency): Promise<number> {
  for (let daysBack = 1; daysBack <= MAX_LOOKBACK_DAYS; daysBack += 1) {
    const date = new Date()
    date.setDate(date.getDate() - daysBack)
    const rate = await fetchNbpRateForDate(currency, formatNbpDate(date))
    if (rate !== null) {
      return rate
    }
  }

  throw new Error(`Could not fetch NBP rate for ${currency} within ${MAX_LOOKBACK_DAYS} days`)
}

export async function fetchNbpTableARates(): Promise<NbpTableARates> {
  const entries = await Promise.all(
    NBP_TABLE_A_CURRENCIES.map(async currency => [currency, await fetchLatestNbpRate(currency)] as const),
  )

  return Object.fromEntries(entries) as NbpTableARates
}
