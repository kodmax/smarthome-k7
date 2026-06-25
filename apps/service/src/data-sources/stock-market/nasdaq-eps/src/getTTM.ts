import { TrailingEPS } from '@repo/types'
import { EarningsResponse, NasdaqApiResponse } from './types'

export const getTTM = async (ticker: string): Promise<TrailingEPS[]> => {
  const req = await fetch(`https://api.nasdaq.com/api/company/${ticker}/earnings-surprise`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
      priority: 'u=1, i',
      'sec-ch-ua': '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      Referer: 'https://www.nasdaq.com/',
    },
    body: null,
    method: 'GET',
  })

  const resp: NasdaqApiResponse<EarningsResponse | null> = await req.json()
  return resp.data !== null
    ? resp.data.earningsSurpriseTable.rows.map(
        (row): TrailingEPS => ({
          consensusForecast: +row.consensusForecast,
          dateReported: row.dateReported,
          eps: row.eps,
        }),
      )
    : []
}
