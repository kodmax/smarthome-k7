import { describe, expect, it, vi } from 'vitest'
import {
  HOURLY_SALARY_CALCULATION_PREFERENCE_KEY,
  HourlySalaryCalculationNotConfiguredError,
  JOB_ADS_PREFERENCES_SCOPE,
  loadHourlySalaryCalculation,
  parseHourlySalaryCalculation,
} from './jobAdsPreferences'
import { DEFAULT_HOURLY_SALARY_CALCULATION } from './testFixtures/hourlySalaryCalculation'

describe('parseHourlySalaryCalculation', () => {
  it('accepts a valid configuration object', () => {
    expect(parseHourlySalaryCalculation(DEFAULT_HOURLY_SALARY_CALCULATION)).toEqual(DEFAULT_HOURLY_SALARY_CALCULATION)
  })

  it('returns null for invalid values', () => {
    expect(parseHourlySalaryCalculation(undefined)).toBeNull()
    expect(parseHourlySalaryCalculation({ ...DEFAULT_HOURLY_SALARY_CALCULATION, timeSpentRemote: 0 })).toBeNull()
    expect(
      parseHourlySalaryCalculation({ ...DEFAULT_HOURLY_SALARY_CALCULATION, hybridOfficeDaysPerWeek: 1.5 }),
    ).toBeNull()
  })
})

describe('loadHourlySalaryCalculation', () => {
  it('throws when preference is missing', async () => {
    const db = vi.fn().mockResolvedValue([])

    await expect(loadHourlySalaryCalculation(db as never)).rejects.toThrow(HourlySalaryCalculationNotConfiguredError)
  })

  it('loads configuration from preferences', async () => {
    const customCalculation = {
      ...DEFAULT_HOURLY_SALARY_CALCULATION,
      timeSpentRemote: 6,
    }
    const db = vi.fn().mockResolvedValue([{ value: customCalculation }])

    await expect(loadHourlySalaryCalculation(db as never)).resolves.toEqual(customCalculation)
    expect(db).toHaveBeenCalled()
  })

  it('throws for invalid stored values', async () => {
    const db = vi.fn().mockResolvedValue([{ value: { timeSpentRemote: '7' } }])

    await expect(loadHourlySalaryCalculation(db as never)).rejects.toThrow(HourlySalaryCalculationNotConfiguredError)
  })
})

describe('hourly salary calculation preference key', () => {
  it('uses the job-ads scope and dedicated key', () => {
    expect(JOB_ADS_PREFERENCES_SCOPE).toBe('job-ads')
    expect(HOURLY_SALARY_CALCULATION_PREFERENCE_KEY).toBe('hourly_salary_calculation')
  })
})
