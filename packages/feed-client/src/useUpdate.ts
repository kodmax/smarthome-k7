import { useEffect, useState } from 'react'
import { subscribe } from './feed'

type Value<T> = [ T | undefined, number | undefined ]
const useUpdate = <T, P = any>(topic: string, initialValue?: T, value?: (payload: P) => T): Value<T> => {
    const [payload, setPayload] = useState<T | undefined>(initialValue)
    const [updatedAt, setUpdatedAt] = useState<number>()

    useEffect(() => {
        const subs = subscribe<P>(topic, update => {
            setPayload(value ? value(update.payload) : update.payload as unknown as T)
            setUpdatedAt(new Date().getTime())
        })

        return () => {
            subs.unsubscribe()
        }
    }, [])

    return [payload, updatedAt]
}

export { useUpdate }
