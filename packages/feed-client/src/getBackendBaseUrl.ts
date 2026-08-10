export function getBackendBaseUrl(location: Pick<Location, 'origin'> = window.location): string {
  const configured = import.meta.env.VITE_BACKEND_BASE_URL
  if (configured !== undefined && configured.length > 0) {
    return configured.replace(/\/$/, '')
  }

  return location.origin
}
