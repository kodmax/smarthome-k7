import type { ApolloRef, JobListingSearchResult, SearchResults, StartupResult, WellfoundListing } from './types'

function isApolloRef(value: unknown): value is ApolloRef {
  return (
    typeof value === 'object' && value !== null && '__ref' in value && typeof (value as ApolloRef).__ref === 'string'
  )
}

function resolveRef<T>(ref: T | ApolloRef, apolloData: Record<string, unknown>): T | undefined {
  if (isApolloRef(ref)) {
    return apolloData[ref.__ref] as T | undefined
  }
  return ref
}

export function parseNextData(html: string): Record<string, unknown> {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/)
  if (!match?.[1]) {
    throw new Error('Could not find __NEXT_DATA__ in HTML')
  }

  const parsed = JSON.parse(match[1]) as {
    props?: { pageProps?: { apolloState?: { data?: Record<string, unknown> } } }
  }
  const apolloData = parsed.props?.pageProps?.apolloState?.data
  if (!apolloData) {
    throw new Error('Could not find apolloState.data in __NEXT_DATA__')
  }

  return apolloData
}

export function findSearchResults(apolloData: Record<string, unknown>): SearchResults {
  const rootQuery = apolloData.ROOT_QUERY as Record<string, unknown> | undefined
  const talent = rootQuery?.talent as Record<string, unknown> | undefined
  if (!talent) {
    throw new Error('Could not find ROOT_QUERY.talent in apolloState')
  }

  const searchKey = Object.keys(talent).find(key => key.includes('seoLandingPageJobSearchResults'))
  if (!searchKey) {
    throw new Error('Could not find seoLandingPageJobSearchResults in apolloState')
  }

  return talent[searchKey] as SearchResults
}

export type PageParseResult = {
  searchResults: SearchResults
  listings: WellfoundListing[]
}

export function parseApolloPage(html: string): PageParseResult {
  const apolloData = parseNextData(html)
  const searchResults = findSearchResults(apolloData)
  const listings: WellfoundListing[] = []

  for (const startupRef of searchResults.startups ?? []) {
    const startup = resolveRef<StartupResult>(startupRef, apolloData)
    if (!startup) {
      continue
    }

    for (const jobRef of startup.highlightedJobListings ?? []) {
      const job = resolveRef<JobListingSearchResult>(jobRef, apolloData)
      if (!job || job.__typename !== 'JobListingSearchResult') {
        continue
      }

      listings.push({
        job,
        companyName: startup.name,
        companyLogoUrl: startup.logoUrl ?? '',
      })
    }
  }

  return { searchResults, listings }
}
