import { EPSForecast } from '@repo/types'
import { EarningsForecastResponse, NasdaqApiResponse } from './types'

export const getForecast = async (ticker: string): Promise<EPSForecast[]> => {
  const req = await fetch(`https://api.nasdaq.com/api/analyst/${ticker}/earnings-forecast`, {
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

  const resp: NasdaqApiResponse<EarningsForecastResponse> = await req.json()
  return resp.data.quarterlyForecast !== null
    ? resp.data.quarterlyForecast.rows.map(
        (row): EPSForecast => ({
          consensusEPSForecast: row.consensusEPSForecast,
          noOfEstimates: row.noOfEstimates,
          fiscalEnd: row.fiscalEnd,
        }),
      )
    : []
}
