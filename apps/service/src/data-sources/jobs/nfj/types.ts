export type NoFluffJobsAd = {
  id: string
  title: string
  url: string
  name: string
  logo: { original: string }
  fullyRemote: boolean
  salary: {
    from?: number
    to?: number
    type: 'b2b' | 'permanent'
  }
  tiles: {
    values: Array<{
      value: string
      type: 'category' | 'requirement'
    }>
  }
}
