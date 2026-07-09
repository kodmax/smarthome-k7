import { useEffect, useState } from 'react'
import { getMarketCountdownRefreshDelay } from './getMarketCountdownRefreshDelay'

type UseAlignedTimeoutLoopOptions = {
  enabled: boolean
  getRemaining: (now: number) => number
}

export const useAlignedTimeoutLoop = ({ enabled, getRemaining }: UseAlignedTimeoutLoopOptions): number => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNextTick = () => {
      const currentNow = Date.now()
      setNow(currentNow)

      const remaining = getRemaining(currentNow)
      timeoutId = setTimeout(scheduleNextTick, getMarketCountdownRefreshDelay(remaining, currentNow))
    }

    scheduleNextTick()

    return () => clearTimeout(timeoutId)
  }, [enabled, getRemaining])

  return now
}
