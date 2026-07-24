import { ContractType, SalaryRange } from '@repo/types'

export interface Ad {
  id: '47a40000-59d6-3231-434e-08dec78793b9'
  groupId: '9c7de7ae-6365-f111-8fcb-6045bdf5bd72'
  title: 'Web Engineer'
  employer: 'Mindbox Sp. z o.o.'
  employerId: '1074221283'
  logoUrl: 'https://logos.gpcdn.pl/loga-firm/1074221283/60420000-56be-0050-9373-08debd8a5df7_280x280.png'
  offerUrlName: 'web-engineer-warszawa,oferta,47a40000-59d6-3231-434e-08dec78793b9'
  aboutProject: [
    'We are building the future of Banking-as-a-Service (BaaS). Our mission is to create the UK’s leading BaaS platform, powered by innovative technology and backed by reliable infrastructure.',
    'As a Web Engineer, you will work as part of a high-performing agile feature team, developing scalable, secure, and maintainable front-end applications. This is a hands-on position where you’ll use your expertise in React, JavaScript/TypeScript, and modern development frameworks to deliver outstanding web experiences.',
    'Sounds like your kind of challenge?',
  ]
  workplace: [
    {
      location: 'Warszawa'
      city: 'Warszawa'
      region: 'Masovian'
    },
  ]
  positionLevels: [
    {
      value: 'senior'
    },
  ]
  typesOfContracts: [
    {
      id: 3
      salary: null | {
        from: number
        to: number
        currencySymbol: 'zł'
        timeUnitId: 0 | 1 // 0 - month, 1 - hour
        timeUnit: {
          shortForm: 'mth.' | 'godz.' | 'hr.' | 'mies.'
          longForm: string
        }
        kindName: 'net (+ VAT)' | 'brutto' | 'gross' | 'netto (+ VAT)'
      }
    },
  ]
  technologies: string[]
  new: false
  publicationDateUtc: string
  lastCall: false
  language: 'en'
  salary: {
    to: 30000.0
    currency: 'zł'
    timeUnit: {
      shortForm: 'mth.' | 'mies.'
      longForm: 'monthly'
    }
  }
  workModes: ['hybrid', 'remote', 'zdalna', 'hybrydowa', 'full office', 'stacjonarna']
  immediateEmployment: true
  isSupportingUkraine: true
  addons: {
    searchableLocations: []
    searchableRegions: []
    isWholePoland: false
  }
  isFromExternalLocations: false
  badges: {
    new: false
    lastCall: false
    immediateEmployment: true
    isSupportingUkraine: true
    isFromExternalLocations: false
    isQuickApply: false
  }
  alpha: null
}

export interface Filters {
  cities: [
    {
      displayName: string
      urlName: string
    },
  ]
  regionsOfWorld: []
  technologies: []
  expectedTechnologies: string[]
  excludedTechnologies: []
  niceToHaveTechnologies: []
  keywords: []
  specializationsCodes: []
}

export interface SearchResults {
  page: {
    number: number
    size: number
    count: number
  }
  offersCount: number
  offers: Ad[]
  filters: Filters
  orderBy: {
    field: string
    direction: string
  }
}

export interface Contract {
  type: ContractType
  salaryRange: SalaryRange
}
