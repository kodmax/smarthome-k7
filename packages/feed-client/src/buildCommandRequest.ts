import type { CommandPayloadRegistry } from '@repo/types'

type StringCommandBodyKey = 'itemId' | 'itemUid' | 'adId' | 'query' | 'torrent'

const STRING_COMMAND_BODY_KEYS: {
  [S in keyof CommandPayloadRegistry]?: Partial<Record<keyof CommandPayloadRegistry[S] & string, StringCommandBodyKey>>
} = {
  'job-ads': {
    fav: 'itemId',
    unfav: 'itemId',
    'analyze-cv-match': 'adId',
  },
  news: {
    read: 'itemUid',
    unread: 'itemUid',
  },
  torrents: {
    search: 'query',
  },
  transmission: {
    download: 'torrent',
  },
}

export type CommandRequest = {
  url: string
  body?: unknown
}

export function buildCommandRequest<S extends keyof CommandPayloadRegistry, N extends keyof CommandPayloadRegistry[S]>(
  apiBaseUrl: string,
  sourceId: S,
  name: N,
  payload: CommandPayloadRegistry[S][N],
): CommandRequest {
  const url = `${apiBaseUrl}/data-sources/${sourceId}/command/${String(name)}`

  if (payload === undefined) {
    return { url }
  }

  if (typeof payload === 'string') {
    const bodyKey = STRING_COMMAND_BODY_KEYS[sourceId]?.[name as keyof CommandPayloadRegistry[S] & string]
    if (bodyKey === undefined) {
      throw new Error(`Unknown string command payload mapping: ${String(sourceId)}.${String(name)}`)
    }

    return { url, body: { [bodyKey]: payload } }
  }

  return { url, body: payload }
}
