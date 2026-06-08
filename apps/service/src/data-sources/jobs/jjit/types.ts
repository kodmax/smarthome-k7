import { Skill } from '..'

export type SalaryCurrency = 'PLN' | 'USD' | 'EUR'

export type Location = {
  city: string
}

export type JJEmploymentType = {
  from: number | null
  fromPerUnit: number | null
  to: number | null
  toPerUnit: number | null
  currency: SalaryCurrency
  currencySource: 'original'
  type: 'permanent' | 'b2b' | 'any' | 'mandate_contract'
  unit: 'Month' | 'Year' | 'Day' | 'Hour'
  gross: boolean
}

export type JustJoinAd = {
  title: string
  guid: string
  slug: string
  city: string
  requiredSkills: Skill[]
  employmentTypes: JJEmploymentType[]
  street: string
  companyLogoThumbUrl: string
  companyName: string
  experienceLevel: string
  workplaceType: 'remote' | 'hybrid' | 'office'
  niceToHaveSkills: Skill[]
}
