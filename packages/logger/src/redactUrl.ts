/** Returns protocol and host from a URL, omitting credentials and path. */
export function redactUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return `${parsed.protocol}//${parsed.host}`
  } catch {
    return '[invalid-url]'
  }
}
