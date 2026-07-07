import { NasdaqApiMarketInfo, NasdaqApiResponse } from './types'
import { NasdaqMarketInfo } from '../types'
import { parseNasdaqEasternDisplay, parseNasdaqTradeDate } from './parseNasdaqEastern'

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
    previousTradeDate: parseNasdaqTradeDate(resp.data.previousTradeDate),
    nextTradeDate: parseNasdaqTradeDate(resp.data.nextTradeDate),
    preMarketOpeningTime: parseNasdaqEasternDisplay(resp.data.preMarketOpeningTime),
    preMarketClosingTime: parseNasdaqEasternDisplay(resp.data.preMarketClosingTime),
    marketOpeningTime: parseNasdaqEasternDisplay(resp.data.marketOpeningTime),
    marketClosingTime: parseNasdaqEasternDisplay(resp.data.marketClosingTime),
    afterHoursMarketOpeningTime: parseNasdaqEasternDisplay(resp.data.afterHoursMarketOpeningTime),
    afterHoursMarketClosingTime: parseNasdaqEasternDisplay(resp.data.afterHoursMarketClosingTime),
  }
}
