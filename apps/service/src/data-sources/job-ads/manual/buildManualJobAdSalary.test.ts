import { describe, expect, it } from 'vitest'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'
import { buildManualJobAdSalary } from './buildManualJobAdSalary'

describe('buildManualJobAdSalary', () => {
  it('returns undefined when salary is omitted', () => {
    expect(buildManualJobAdSalary('permanent', undefined, undefined)).toBeUndefined()
  })

  it('uses single salary value for both bounds', () => {
    expect(buildManualJobAdSalary('permanent', 50_000, undefined)).toEqual(
      buildManualJobAdSalary('permanent', 50_000, 50_000),
    )
  })

  it('converts permanent gross monthly to net range', () => {
    expect(buildManualJobAdSalary('permanent', 50_000, 67_000)).toEqual(
      getMonthlySalaryAfterTax('permanent', 'Month', 50_000, 67_000),
    )
  })

  it('converts b2b net monthly range', () => {
    expect(buildManualJobAdSalary('b2b', 20_000, 25_000)).toEqual(
      getMonthlySalaryAfterTax('b2b', 'Month', 20_000, 25_000),
    )
  })

  it('applies paid vacation days for b2b offers', () => {
    expect(buildManualJobAdSalary('b2b', 30_000, 30_000, 20)).toEqual(
      getMonthlySalaryAfterTax('b2b', 'Month', 30_000, 30_000, 20),
    )
  })

  it('ignores paid vacation days for permanent offers', () => {
    expect(buildManualJobAdSalary('permanent', 50_000, 67_000, 20)).toEqual(
      buildManualJobAdSalary('permanent', 50_000, 67_000),
    )
  })

  it('drops implausible salary ranges', () => {
    expect(buildManualJobAdSalary('permanent', 1_000, 2_000)).toBeUndefined()
  })
})
