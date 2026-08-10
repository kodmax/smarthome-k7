import { getBackendBaseUrl } from './getBackendBaseUrl'

export function getDefaultApiBaseUrl(location: Pick<Location, 'origin'> = window.location): string {
  return `${getBackendBaseUrl(location)}/api`
}
