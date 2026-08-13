import { JobAdsFeedItem } from '@repo/types'
import { dedupeSkillsById } from '../../requiredSkills'
import { reverseManualJobAdSalary } from './manualJobAdSalary'
import { formatSalaryInput, initialAddFormState, type ManualJobAdFormState } from './manualJobAdFormState'

export type ManualJobAdFormAction =
  | { type: 'reset-add' }
  | { type: 'load-from-ad'; ad: JobAdsFeedItem }
  | { type: 'patch'; patch: Partial<ManualJobAdFormState> }
  | { type: 'set-employment-type'; employmentType: 'permanent' | 'b2b' }
  | { type: 'set-required-skills'; skills: string[] }

function formStateFromEditAd(ad: JobAdsFeedItem): ManualJobAdFormState {
  const employmentType = ad.content.employmentType === 'b2b' ? 'b2b' : 'permanent'
  const reversedSalary = reverseManualJobAdSalary(
    employmentType,
    ad.content.monthlySalaryRangeAfterTaxes,
    ad.content.paidVacationDays,
  )

  return {
    ...initialAddFormState,
    workplaceType: ad.content.workplaceType,
    employmentType,
    salaryFrom: formatSalaryInput(reversedSalary.salaryFrom),
    salaryTo: formatSalaryInput(reversedSalary.salaryTo),
    requiredSkills: dedupeSkillsById(ad.content.requiredSkills),
    paidVacationDays: formatSalaryInput(ad.content.paidVacationDays),
  }
}

export function manualJobAdFormReducer(
  state: ManualJobAdFormState,
  action: ManualJobAdFormAction,
): ManualJobAdFormState {
  switch (action.type) {
    case 'reset-add':
      return initialAddFormState
    case 'load-from-ad':
      return formStateFromEditAd(action.ad)
    case 'patch':
      return { ...state, ...action.patch }
    case 'set-employment-type':
      return {
        ...state,
        employmentType: action.employmentType,
        paidVacationDays: action.employmentType === 'permanent' ? '' : state.paidVacationDays,
      }
    case 'set-required-skills':
      return { ...state, requiredSkills: dedupeSkillsById(action.skills) }
    default:
      return state
  }
}
