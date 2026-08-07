import { describe, expect, it } from 'vitest'
import { parseDeleteManualJobAdArgs, parseEditManualJobAdArgs } from './parseEditManualJobAdArgs'

describe('parseEditManualJobAdArgs', () => {
  it('parses editable fields only', () => {
    expect(
      parseEditManualJobAdArgs(
        JSON.stringify({
          id: 'manual-1',
          workplaceType: 'hybrid',
          employmentType: 'b2b',
          salaryFrom: 20_000,
          salaryTo: 25_000,
          requiredSkills: ['TypeScript'],
        }),
      ),
    ).toEqual({
      id: 'manual-1',
      workplaceType: 'hybrid',
      employmentType: 'b2b',
      salaryFrom: 20_000,
      salaryTo: 25_000,
      requiredSkills: ['TypeScript'],
    })
  })

  it('rejects invalid requiredSkills', () => {
    expect(
      parseEditManualJobAdArgs(
        JSON.stringify({
          id: 'manual-1',
          workplaceType: 'hybrid',
          employmentType: 'b2b',
          requiredSkills: ['React', 1],
        }),
      ),
    ).toBeNull()
  })

  it('rejects invalid salary range', () => {
    expect(
      parseEditManualJobAdArgs(
        JSON.stringify({
          id: 'manual-1',
          workplaceType: 'hybrid',
          employmentType: 'b2b',
          salaryFrom: 30_000,
          salaryTo: 20_000,
          requiredSkills: [],
        }),
      ),
    ).toBeNull()
  })

  it('parses paid vacation days for b2b edits', () => {
    expect(
      parseEditManualJobAdArgs(
        JSON.stringify({
          id: 'jj-1',
          workplaceType: 'hybrid',
          employmentType: 'b2b',
          requiredSkills: [],
          paidVacationDays: 20,
        }),
      ),
    ).toEqual({
      id: 'jj-1',
      workplaceType: 'hybrid',
      employmentType: 'b2b',
      requiredSkills: [],
      paidVacationDays: 20,
    })
  })
})

describe('parseDeleteManualJobAdArgs', () => {
  it('parses id', () => {
    expect(parseDeleteManualJobAdArgs(JSON.stringify({ id: 'manual-1' }))).toBe('manual-1')
  })

  it('rejects empty id', () => {
    expect(parseDeleteManualJobAdArgs(JSON.stringify({ id: '  ' }))).toBeNull()
  })
})
