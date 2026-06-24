import { PrefetchedApiResponse } from './types'

export const getApiData = <T>(document: Document, url: string): T => {
  const script = document.querySelector(`script[type="application/json"][data-sveltekit-fetched][data-url^="${url}"]`)
  if (script === null) {
    throw new Error('API Data script not found')
  }

  const resp = JSON.parse(script.textContent ?? '') as PrefetchedApiResponse
  return JSON.parse(resp.body)
}
