import type { JobAdMatchAnalysis } from '@repo/types'
import { getDefaultApiBaseUrl } from './getDefaultApiBaseUrl'

export class JobAdCvMatchFetchError extends Error {
  constructor(
    readonly adId: string,
    readonly status: number,
  ) {
    super(`Job ad CV match fetch failed: ${adId} (${status})`)
    this.name = 'JobAdCvMatchFetchError'
  }
}

const logFetchError = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    console.error(...args)
  }
}

export function fetchJobAdCvMatch(adId: string): Promise<JobAdMatchAnalysis> {
  const url = `${getDefaultApiBaseUrl()}/data-sources/job-ads/cv-match/${encodeURIComponent(adId)}`

  return fetch(url, { cache: 'no-store' })
    .then(async response => {
      if (!response.ok) {
        throw new JobAdCvMatchFetchError(adId, response.status)
      }

      return (await response.json()) as JobAdMatchAnalysis
    })
    .catch(error => {
      if (!(error instanceof JobAdCvMatchFetchError)) {
        logFetchError('[feed-client] job ad CV match fetch error', { adId, url, error })
      }

      throw error
    })
}
