import { getBackendBaseUrl } from './getBackendBaseUrl'

export function getDefaultWebSocketUrl(location: Pick<Location, 'origin'> = window.location): string {
  const base = new URL(getBackendBaseUrl(location))
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:'
  base.pathname = '/ws'
  base.search = ''
  base.hash = ''
  return base.toString().replace(/\/$/, '')
}
