import { MarketInfo } from '@repo/types'
import { useCallback, useMemo } from 'react'
import { formatMarketDuration } from './helpers/formatMarketDuration'
import { getEffectiveMarketStatus } from './helpers/getEffectiveMarketStatus'
import { getMarketCountdownRemaining, getMarketCountdownTarget } from './helpers/getMarketCountdownTarget'
import { useAlignedTimeoutLoop } from './helpers/useAlignedTimeoutLoop'

export type MarketSession = {
  countdown: string
  status: ReturnType<typeof getEffectiveMarketStatus>
}

export const useMarketSession = (marketInfo: MarketInfo | undefined): MarketSession | undefined => {
  const getRemaining = useCallback(
    (now: number) => (marketInfo === undefined ? 0 : getMarketCountdownRemaining(marketInfo, now)),
    [marketInfo],
  )

  const now = useAlignedTimeoutLoop({
    enabled: marketInfo !== undefined,
    getRemaining,
  })

  return useMemo(() => {
    if (marketInfo === undefined) {
      return undefined
    }

    const { prefix } = getMarketCountdownTarget(marketInfo, now)
    const remaining = getMarketCountdownRemaining(marketInfo, now)

    return {
      status: getEffectiveMarketStatus(marketInfo, now),
      countdown: `${prefix} ${formatMarketDuration(remaining)}`,
    }
  }, [marketInfo, now])
}
