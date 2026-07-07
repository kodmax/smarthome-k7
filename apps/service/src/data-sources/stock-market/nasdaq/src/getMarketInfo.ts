import { NasdaqApiMarketInfo, NasdaqApiResponse } from './types'
import { NasdaqMarketInfo } from '../types'

export const getMarketInfo = async (): Promise<NasdaqMarketInfo> => {
  const req = await fetch('https://api.nasdaq.com/api/market-info', {
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

  const resp: NasdaqApiResponse<NasdaqApiMarketInfo> = await req.json()

  return {
    country: resp.data.country,
    status: resp.data.mrktStatus,
    indicator: resp.data.marketIndicator,
    uiIndicator: resp.data.uiMarketIndicator,
    countdown: resp.data.mrktCountDown,
    marketCountdown: resp.data.marketCountDown,
    isBusinessDay: resp.data.isBusinessDay,
    previousTradeDate: resp.data.previousTradeDate,
    nextTradeDate: resp.data.nextTradeDate,
    preMarketOpeningTime: resp.data.preMarketOpeningTime,
    preMarketClosingTime: resp.data.preMarketClosingTime,
    marketOpeningTime: resp.data.marketOpeningTime,
    marketClosingTime: resp.data.marketClosingTime,
    afterHoursMarketOpeningTime: resp.data.afterHoursMarketOpeningTime,
    afterHoursMarketClosingTime: resp.data.afterHoursMarketClosingTime,
    schedule: {
      preMarketOpen: resp.data.pmOpenRaw,
      marketOpen: resp.data.openRaw,
      marketClose: resp.data.closeRaw,
      afterHoursClose: resp.data.ahCloseRaw,
    },
  }
}
