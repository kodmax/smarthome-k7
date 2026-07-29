import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/scraperMetrics'
import { detectOrigin } from './detectOrigin'
import { parseJobPosting as parseJjitJobPosting } from './jjit/parseJobPosting'
import { parseJobPosting as parseNfjJobPosting } from './nfj/parseJobPosting'
import type { JobPostingDetails } from './types'

export async function fetchJobPostingDetails(adUrl: string): Promise<JobPostingDetails | null> {
  const origin = detectOrigin(adUrl)
  if (origin === null || origin === 'theprotocol') {
    return null
  }

  const document = await observeHttpFetch(adUrl, 'html', () => fetchDocument(adUrl))
  switch (origin) {
    case 'jj':
      return parseJjitJobPosting(document)
    case 'nfj':
      return parseNfjJobPosting(document)
  }
}
