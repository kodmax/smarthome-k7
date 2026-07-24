import { EmploymentType } from '@repo/types'

export type NoFluffJobsAd = {
  id: string
  title: string
  url: string
  name: string
  logo: { original: string }
  location: {
    fullyRemote: boolean
  }
  salary: {
    from?: number
    to?: number
    type: EmploymentType
  }
  tiles: {
    values: Array<{
      value: string
      type: 'category' | 'requirement'
    }>
  }
  posted: number
  renewed?: number
}
