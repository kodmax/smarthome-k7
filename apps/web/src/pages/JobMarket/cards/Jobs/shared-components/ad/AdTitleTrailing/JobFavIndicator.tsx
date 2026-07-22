import { FavStarIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { jobTitleIconSize } from '../titleIconSize'

export const JobFavIndicator: FC<{ fav: boolean }> = ({ fav }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobs

  if (!fav) {
    return null
  }

  return (
    <FavStarIcon
      size={jobTitleIconSize}
      strokeWidth={designTokens.icon.strokeWidth}
      glow='default'
      aria-label={labels.favourite}
      style={{
        verticalAlign: 'middle',
        display: 'inline',
      }}
    />
  )
}
