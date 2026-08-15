export function buildTracePropagationUrls(): Array<string | RegExp> {
  const urls: Array<string | RegExp> = ['localhost', /\/api\//]

  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL
  if (backendBaseUrl !== undefined && backendBaseUrl.length > 0) {
    urls.push(backendBaseUrl.replace(/\/$/, ''))
  }

  return urls
}
