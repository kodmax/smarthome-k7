import { TickerData } from '@repo/types'

export const getEarningsDaysLeft = (item: TickerData): number | null => {
  const date = item.earningsDate.confirmed ?? item.earningsDate.estimated
  if (date === undefined) {
    return null
  }

  const daysLeft = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
  return daysLeft > 0 && daysLeft <= 30 ? daysLeft : null
}
