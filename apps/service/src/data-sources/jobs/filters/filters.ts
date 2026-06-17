import { JobAd } from '@repo/types'

export const isHybridOrRemote: (offer: JobAd) => boolean = offer =>
  offer.workplaceType === 'hybrid' || offer.workplaceType === 'remote'

const MIN_SALARY = 25_000
export const isSalaryAcceptable = (ad: JobAd): boolean =>
  ad.monthlySalaryRangeAfterTaxes !== undefined && ad.monthlySalaryRangeAfterTaxes.to > MIN_SALARY

const unwantedCompanies = [
  'monday.com',
  'FINN',
  'Kalepa',
  'ClickUp',
  'Daytrip',
  'Cavendish Professionals',
  'HAYS Poland',
  'DevsData LLC',
  'Evolution',
  'L2BEAT',
  'RemoDevs',
  'Playbook',
  'Guesty',
  'ICEO',
  'Codi',
  'Ramp',
  'Blackbird',
  'Sensor',
  'Physitrack',
  'Gibbs',
  'Maxio',
  'Focal',
  'Yard',
  'Adverity',
  'Ntiative',
  'Wildland',
  'Devire',
  'Winged IT',
  'Link Group',
  'DCX',
]

export const isUnwantedCompany: (companyName: string) => boolean = companyName =>
  unwantedCompanies.some(name => companyName.startsWith(name))

const unwantedSkills = [
  /^python/i,
  /^vue/i,
  /^\.net/i,
  /^java$|^java /i,
  /^ruby/i,
  /^c#.*/i,
  /^kotlin/i,
  /^gatsby/i,
  /^adobe/i,
  /^golang/i,
  /^grails/i,
  /^elixir/i,
  /^llm/i,
  /^sap/i,
  /^salesforce/i,
  /^angular/i,
]

export const noUwantedSkills: (ad: JobAd) => boolean = ({ requiredSkills }) => {
  return !requiredSkills.some(skillName => unwantedSkills.some(unwanted => unwanted.test(skillName)))
}

export const noManager: (ad: JobAd) => boolean = ({ title }) => {
  return !/\bmanager\b/i.test(title)
}

export const withReact: (ad: JobAd) => boolean = ({ requiredSkills }) => {
  return requiredSkills.includes('React')
}
