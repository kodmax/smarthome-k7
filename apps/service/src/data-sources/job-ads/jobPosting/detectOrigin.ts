import type { JobPostingOrigin } from './types'

export function detectOrigin(adUrl: string): JobPostingOrigin | null {
  let url: URL
  try {
    url = new URL(adUrl)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '')

  if (host === 'justjoin.it' && url.pathname.startsWith('/job-offer/')) {
    return 'jj'
  }

  if (host === 'nofluffjobs.com' && url.pathname.includes('/job/')) {
    return 'nfj'
  }

  if (host === 'theprotocol.it' && url.pathname.startsWith('/szczegoly/praca/')) {
    return 'theprotocol'
  }

  return null
}
