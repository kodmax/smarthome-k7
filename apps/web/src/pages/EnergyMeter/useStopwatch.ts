import { useEffect, useState } from 'react'
import type { MeterStatus } from './types'

export const useStopwatch = (meterStatus: MeterStatus): number => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (meterStatus !== 'started') {
      return
    }

    const startedAt = Date.now()
    setElapsedSeconds(0)

    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }, 100)

    return () => {
      clearInterval(id)
    }
  }, [meterStatus])

  return elapsedSeconds
}
