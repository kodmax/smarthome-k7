import { buildCommandRequest, getDefaultApiBaseUrl } from '@repo/feed-client'
import type { CommandPayloadRegistry } from '@repo/types'

export async function readFeed<T = unknown>(id: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${getDefaultApiBaseUrl()}/feeds/${encodeURIComponent(id)}`, {
    cache: 'no-store',
    signal,
  })
  if (!response.ok) throw new Error(`Feed ${id}: HTTP ${response.status}`)
  return response.json() as Promise<T>
}

export async function readFeeds(ids: readonly string[], signal: AbortSignal) {
  const entries = await Promise.all(
    ids.map(async id => {
      try {
        return [id, await readFeed(id, signal)] as const
      } catch (error) {
        signal.throwIfAborted()
        return [id, { error: error instanceof Error ? error.message : 'Feed unavailable' }] as const
      }
    }),
  )
  return Object.fromEntries(entries)
}

export async function command<S extends keyof CommandPayloadRegistry, N extends keyof CommandPayloadRegistry[S]>(
  source: S,
  name: N,
  payload: CommandPayloadRegistry[S][N],
  signal: AbortSignal,
): Promise<void> {
  const { url, body } = buildCommandRequest(getDefaultApiBaseUrl(), source, name, payload)
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  if (!response.ok) throw new Error(`Command ${source}.${String(name)}: HTTP ${response.status}`)
}

export function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted()
    const abort = () => {
      clearTimeout(timer)
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      resolve()
    }, ms)
    signal.addEventListener('abort', abort, { once: true })
  })
}
