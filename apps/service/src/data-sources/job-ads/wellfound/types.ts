export type ApolloRef = { __ref: string }

export type JobListingRemoteConfig = {
  __typename: 'JobListingRemoteConfig'
  kind: 'REMOTE' | 'ONSITE_OR_REMOTE' | string
  wfhFlexible: boolean
}

export type JobListingSearchResult = {
  __typename: 'JobListingSearchResult'
  id: string
  slug: string
  title: string
  compensation?: string | null
  remote: boolean
  remoteConfig?: JobListingRemoteConfig | null
  acceptedRemoteLocationNames?: string[] | null
  locationNames?: string[] | null
  yearsExperienceMin?: number | null
  yearsExperienceMax?: number | null
  primaryRoleTitle?: string | null
  liveStartAt?: number | null
}

export type StartupResult = {
  __typename: 'StartupResult'
  id: string
  name: string
  slug: string
  logoUrl?: string | null
  highlightedJobListings?: Array<JobListingSearchResult | ApolloRef> | null
}

export type SearchResults = {
  __typename: 'Results'
  totalJobCount: number
  totalStartupCount: number
  perPage: number
  pageCount: number
  startups: Array<StartupResult | ApolloRef>
}

export type WellfoundListing = {
  job: JobListingSearchResult
  companyName: string
  companyLogoUrl: string
}
