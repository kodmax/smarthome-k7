const MINUTE_MS = 60_000
const FIFTEEN_MINUTES_MS = 15 * MINUTE_MS
const SECOND_MS = 1_000
const SUB_SECOND_MS = 100

export const getMarketCountdownRefreshDelay = (remainingMs: number, now: number): number => {
  let interval: number

  if (remainingMs <= 5 * SECOND_MS) {
    interval = SUB_SECOND_MS
  } else if (remainingMs > FIFTEEN_MINUTES_MS) {
    interval = MINUTE_MS
  } else {
    interval = SECOND_MS
  }

  return interval - (now % interval)
}
