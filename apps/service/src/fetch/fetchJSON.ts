import { fetchText } from './fetchText'

export async function fetchJSON<T>(url: string, extraHeaders?: Record<string, string>, method = 'GET'): Promise<T> {
  const text = await fetchText(url, { accept: 'application/json, */*', ...extraHeaders }, method)
  return JSON.parse(text) as T
}
