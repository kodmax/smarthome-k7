import { useEffect, useState } from 'react'
import { subscribe } from './feed'

/**
 * Reads live data from a WebSocket feed topic.
 *
 * @returns The latest payload for `topic`, or `initialValue` until the first message arrives.
 *
 * @param topic - Server feed id (e.g. `'weather'`, `'energy'`). Must be the same on every render.
 * @param initialValue - Placeholder returned before the first feed message. Not updated when this argument changes.
 * @param value - Maps the raw payload (`P`) to the returned type (`T`). Must be stable across renders when provided.
 *
 * @example
 * const weather = useFeed<WeatherFeed>('weather')
 * const co2 = useFeed<Co2Data>('home.air-quality.co2')
 */
const useFeed = <T, P = T>(topic: string, initialValue?: T, value?: (payload: P) => T): T | undefined => {
  const [payload, setPayload] = useState<T | undefined>(initialValue)

  useEffect(() => {
    return subscribe(topic, update => {
      setPayload(value ? value(update.payload as P) : (update.payload as T))
    })
  }, [])

  return payload
}

export { useFeed }
