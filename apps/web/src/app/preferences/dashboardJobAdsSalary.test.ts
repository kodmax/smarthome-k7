import { describe, expect, it } from 'vitest'
import {
  DASHBOARD_JOB_ADS_SALARY_STORAGE_KEY,
  getStoredDashboardJobAdsSalary,
  setStoredDashboardJobAdsSalary,
} from './dashboardJobAdsSalary'

describe('dashboardJobAdsSalary', () => {
  it('returns true when preference is not stored', () => {
    expect(getStoredDashboardJobAdsSalary()).toBe(true)
  })

  it('stores and reads showSalary preference', () => {
    setStoredDashboardJobAdsSalary(false)
    expect(localStorage.getItem(DASHBOARD_JOB_ADS_SALARY_STORAGE_KEY)).toBe('false')
    expect(getStoredDashboardJobAdsSalary()).toBe(false)

    setStoredDashboardJobAdsSalary(true)
    expect(getStoredDashboardJobAdsSalary()).toBe(true)
  })
})
