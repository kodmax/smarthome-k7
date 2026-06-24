import { TickerData } from '@repo/types'
import { TickerDetails } from '../types'
import { useMemo } from 'react'

export const useTickerDetails = (data: TickerData): TickerDetails => {
  return useMemo<TickerDetails>(() => {
    const forwardPE =
      data.statistics.forwardEPS !== null && data.statistics.forwardEPS > 0 && data.price.priceTarget !== null
        ? data.price.lastTradePrice / data.statistics.forwardEPS
        : null

    const forwardPEAtPriceTarget =
      forwardPE !== null && data.price.priceTarget !== null
        ? (forwardPE * data.price.priceTarget) / data.price.lastTradePrice
        : null

    const trailingPE = data.statistics.trailingEPS > 0 ? data.price.lastTradePrice / data.statistics.trailingEPS : null

    const trailingPEAtPriceTarget =
      trailingPE !== null && data.price.priceTarget !== null
        ? (trailingPE * data.price.priceTarget) / data.price.lastTradePrice
        : null

    const earningsDate = new Date(data.earningsDate.confirmed ?? data.earningsDate.estimated ?? '')
    const earningsDaysLeft = Math.ceil((earningsDate.getTime() - new Date().getTime()) / 86400000)

    return {
      trailingPEAtPriceTarget,
      forwardPEAtPriceTarget,
      earningsDaysLeft,
      earningsDate,
      trailingPE,
      forwardPE,
    }
  }, [data])
}
