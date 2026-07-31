import { calendarDaysBetween } from '@/pages/JobMarket/cards/JobAds/components/JobAdsEditView/JobAdsEditAdList/Ad/AdExpandedEditorRow/ApplicationStatusEditor/formatAppliedDaysAgo'

export const MAX_VISIBLE_APPLIED_DAYS = 14

export function formatAppliedDaysShort(appliedAt: string | null, now = new Date()): string | null {
  if (appliedAt === null) {
    return null
  }

  const days = calendarDaysBetween(new Date(appliedAt), now)

  if (days > MAX_VISIBLE_APPLIED_DAYS) {
    return null
  }

  return `${Math.max(days, 0)}d`
}
