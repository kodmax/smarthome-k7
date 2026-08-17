export const DASHBOARD_JOB_ADS_SALARY_STORAGE_KEY = 'smarthome-dashboard-job-ads-salary'

export const getStoredDashboardJobAdsSalary = (): boolean => {
  const stored = localStorage.getItem(DASHBOARD_JOB_ADS_SALARY_STORAGE_KEY)

  if (stored === null) {
    return true
  }

  return stored !== 'false'
}

export const setStoredDashboardJobAdsSalary = (showSalary: boolean) => {
  localStorage.setItem(DASHBOARD_JOB_ADS_SALARY_STORAGE_KEY, String(showSalary))
}
