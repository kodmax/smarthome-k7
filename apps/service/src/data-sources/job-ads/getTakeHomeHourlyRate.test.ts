import { describe, expect, it } from 'vitest'
import { getTakeHomeHourlyRate } from './getTakeHomeHourlyRate'
import { DEFAULT_HOURLY_SALARY_CALCULATION } from './testFixtures/hourlySalaryCalculation'

const MONTHLY_NET_TO = 22_600

describe('getTakeHomeHourlyRate', () => {
  it('returns undefined when salary range is missing', () => {
    expect(getTakeHomeHourlyRate(undefined, 'remote', DEFAULT_HOURLY_SALARY_CALCULATION)).toBeUndefined()
  })

  it('uses default 150 monthly hours when workplace type is unknown', () => {
    expect(
      getTakeHomeHourlyRate({ from: MONTHLY_NET_TO, to: MONTHLY_NET_TO }, undefined, DEFAULT_HOURLY_SALARY_CALCULATION),
    ).toBe(Math.round(MONTHLY_NET_TO / 150))
  })

  it('calculates take-home hourly rate for remote work', () => {
    expect(
      getTakeHomeHourlyRate({ from: MONTHLY_NET_TO, to: MONTHLY_NET_TO }, 'remote', DEFAULT_HOURLY_SALARY_CALCULATION),
    ).toBe(Math.round(MONTHLY_NET_TO / 150))
  })

  it('calculates take-home hourly rate for office work', () => {
    expect(
      getTakeHomeHourlyRate({ from: MONTHLY_NET_TO, to: MONTHLY_NET_TO }, 'office', DEFAULT_HOURLY_SALARY_CALCULATION),
    ).toBe(Math.round(MONTHLY_NET_TO / 168.75))
  })

  it('calculates take-home hourly rate for hybrid work', () => {
    expect(
      getTakeHomeHourlyRate({ from: MONTHLY_NET_TO, to: MONTHLY_NET_TO }, 'hybrid', DEFAULT_HOURLY_SALARY_CALCULATION),
    ).toBe(Math.round(MONTHLY_NET_TO / 161.25))
  })
})
