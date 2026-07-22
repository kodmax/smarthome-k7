import { FC } from 'react'
import { Tag } from '@/card-components'
import { useTranslations } from '@/i18n'
import { isPublishedToday } from './publishedToday'

export const PublishedTodayTag: FC<{ publishedAt: string }> = ({ publishedAt }) => {
  const { t } = useTranslations()

  if (!isPublishedToday(publishedAt)) {
    return null
  }

  return <Tag variant='new'>{t.dashboard.jobs.publishedTodayTag}</Tag>
}
