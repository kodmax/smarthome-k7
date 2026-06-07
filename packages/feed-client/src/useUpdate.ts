import { useEffect, useState } from 'react'
import { subscribe } from './feed'
import { ValueUpdate } from './types'

const useUpdate = <T, P = T>(topic: string, initialValue?: T, value?: (payload: P) => T): ValueUpdate<T> => {
  const [payload, setPayload] = useState<T | undefined>(initialValue)
  const [updatedAt, setUpdatedAt] = useState<number>()

  useEffect(() => {
    return subscribe(topic, update => {
      setPayload(value ? value(update.payload as P) : (update.payload as T))
      setUpdatedAt(new Date().getTime())
    })
  }, [])

  return [payload, updatedAt]
}

export { useUpdate }
