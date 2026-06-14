import { useEffect, useState } from 'react'
import { subscribe } from './feed'

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
