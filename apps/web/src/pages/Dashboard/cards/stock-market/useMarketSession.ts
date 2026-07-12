import { useCallback, useMemo } from 'react'
import { MarketInfo } from '@repo/types'
import { useTranslations } from '@/i18n'
import { formatMarketDuration } from './helpers/formatMarketDuration'
import { getEffectiveMarketStatus } from './helpers/getEffectiveMarketStatus'
import { getMarketCountdownRemaining, getMarketCountdownTarget } from './helpers/getMarketCountdownTarget'
import { useAlignedTimeoutLoop } from './helpers/useAlignedTimeoutLoop'

export type MarketSession = {
  countdown: string
  status: ReturnType<typeof getEffectiveMarketStatus>
}

export const useMarketSession = (marketInfo: MarketInfo | undefined): MarketSession | undefined => {
  const { t } = useTranslations()
  const stockMarket = t.dashboard.stockMarket

  const countdownLabels = useMemo(
    () => ({
      openingIn: stockMarket.openingIn,
      closingIn: stockMarket.closingIn,
    }),
    [stockMarket.closingIn, stockMarket.openingIn],
  )

  const getRemaining = useCallback(
    (now: number) => (marketInfo === undefined ? 0 : getMarketCountdownRemaining(marketInfo, now, countdownLabels)),
    [countdownLabels, marketInfo],
  )

  const now = useAlignedTimeoutLoop({
    enabled: marketInfo !== undefined,
    getRemaining,
  })

  return useMemo(() => {
    if (marketInfo === undefined) {
      return undefined
    }

    const { prefix } = getMarketCountdownTarget(marketInfo, now, countdownLabels)
    const remaining = getMarketCountdownRemaining(marketInfo, now, countdownLabels)

    return {
      status: getEffectiveMarketStatus(marketInfo, now),
      countdown: `${prefix} ${formatMarketDuration(remaining, stockMarket.durationHourSuffix)}`,
    }
  }, [countdownLabels, marketInfo, now, stockMarket.durationHourSuffix])
}
