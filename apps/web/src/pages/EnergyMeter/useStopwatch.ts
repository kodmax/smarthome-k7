import { useEffect, useRef, useState } from 'react'
import type { MeterStatus } from './types'

export const useStopwatch = (meterStatus: MeterStatus): number => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  const baselineTime = useRef<number>(undefined)
  const elapsedTime = useRef<number>(0)

  useEffect(() => {
    if (meterStatus === 'stopped') {
      return
    }

    if (meterStatus === 'reset') {
      baselineTime.current = undefined
      elapsedTime.current = 0
      setElapsedSeconds(0)
      return
    }

    // started
    baselineTime.current = Date.now() - elapsedTime.current
    const id = setInterval(() => {
      elapsedTime.current = baselineTime.current !== undefined ? Date.now() - baselineTime.current : 0
      setElapsedSeconds(Math.floor(elapsedTime.current / 1000))
    }, 100)

    return () => {
      clearInterval(id)
    }
  }, [meterStatus])

  return elapsedSeconds
}
