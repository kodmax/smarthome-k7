import { useCallback, useState } from 'react'
import { getStoredDashboardJobAdsSalary, setStoredDashboardJobAdsSalary } from './dashboardJobAdsSalary'

export const useDashboardJobAdsSalaryPreference = () => {
  const [showSalary, setShowSalaryState] = useState(getStoredDashboardJobAdsSalary)

  const setShowSalary = useCallback((value: boolean) => {
    setStoredDashboardJobAdsSalary(value)
    setShowSalaryState(value)
  }, [])

  return { showSalary, setShowSalary }
}
