import type { CommandPayloadRegistry } from '@repo/types'
import { buildCommandRequest } from './buildCommandRequest'
import { getDefaultApiBaseUrl } from './getDefaultApiBaseUrl'

const apiBaseUrl = getDefaultApiBaseUrl()

const logCommandError = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    console.error(...args)
  }
}

const readErrorBody = async (response: Response): Promise<string | undefined> => {
  try {
    const text = await response.text()
    return text.length > 0 ? text : undefined
  } catch {
    return undefined
  }
}

export function sendCommand<S extends keyof CommandPayloadRegistry, N extends keyof CommandPayloadRegistry[S]>(
  sourceId: S,
  name: N,
  payload: CommandPayloadRegistry[S][N],
): Promise<void> {
  const { url, body } = buildCommandRequest(apiBaseUrl, sourceId, name, payload)

  return fetch(url, {
    method: 'POST',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
    .then(async response => {
      if (response.ok) {
        return
      }

      const responseBody = await readErrorBody(response)
      logCommandError('[feed-client] command failed', {
        sourceId,
        name,
        status: response.status,
        url,
        responseBody,
      })
      throw new Error(`Command failed: ${String(sourceId)}.${String(name)} (${response.status})`)
    })
    .catch(error => {
      if (error instanceof Error && error.message.startsWith('Command failed:')) {
        throw error
      }

      logCommandError('[feed-client] command error', { sourceId, name, url, error })
      throw error
    })
}
