import { IconButton } from '@mui/material'
import { FavStarIcon } from '@repo/assets'
import { JobAd } from '@repo/types'
import { EyeOff, MailCheck, StarPlus, StarX, Undo2 } from 'lucide-react'
import { FC, useMemo } from 'react'
import { designTokens } from '@repo/design-tokens'
import { ApolloTableCell, ApolloTableRow, LinkOpen, ReadingValue } from '@/card-components'
import { useTranslations } from '@/i18n'
import { JobTitle, Salary } from './styled'
import { formatJobSalary } from './formatJobSalary'
import { isFavSkill } from './isFavSkill'

const iconSize = designTokens.icon.sizeXs - 4

export const Ad: FC<{
  ad: JobAd
  zoom: boolean
  editMode: boolean
  onApplied: (id: string) => void
  onHide: (id: string) => void
  onRestore: (id: string) => void
  onFav: (id: string) => void
  onUnfav: (id: string) => void
}> = ({ ad, zoom, editMode, onApplied, onHide, onRestore, onFav, onUnfav }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobs
  const favSkills = useMemo(() => ad.requiredSkills.filter(isFavSkill), [ad])
  const { monthlySalaryFrom, monthlySalaryTo, b2bHourlyRateEquivalent } = useMemo(() => formatJobSalary(ad), [ad])
  const appliedIndicator =
    !editMode && ad.applied ? (
      <MailCheck
        size={iconSize}
        strokeWidth={designTokens.icon.strokeWidth}
        aria-label={labels.applied}
        style={{
          marginRight: `${designTokens.space[1]}px`,
          verticalAlign: 'middle',
          display: 'inline',
          color: 'var(--mui-palette-success-main)',
        }}
      />
    ) : null
  const favIndicator =
    !editMode && ad.fav ? (
      <FavStarIcon
        size={iconSize}
        strokeWidth={designTokens.icon.strokeWidth}
        glow='default'
        aria-label={labels.favourite}
        style={{
          marginRight: `${designTokens.space[1]}px`,
          verticalAlign: 'middle',
          display: 'inline',
        }}
      />
    ) : null

  return (
    <ApolloTableRow>
      {zoom ? <LinkOpen href={ad.advertUrl} /> : null}
      {zoom && editMode ? (
        <ApolloTableCell
          sx={{
            verticalAlign: 'middle',
            boxSizing: 'border-box',
            width: '84px',
            textOverflow: 'clip',
            whiteSpace: 'nowrap',
          }}
        >
          {ad.hide ? (
            <IconButton aria-label={labels.restoreOffer} onClick={() => onRestore(ad.id)} size='small'>
              <Undo2 size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
            </IconButton>
          ) : (
            <>
              <IconButton aria-label={labels.hideOffer} onClick={() => onHide(ad.id)} size='small'>
                <EyeOff size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
              </IconButton>
              {ad.fav ? (
                <IconButton aria-label={labels.removeFromFavourites} onClick={() => onUnfav(ad.id)} size='small'>
                  <StarX size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
                </IconButton>
              ) : (
                <IconButton aria-label={labels.addToFavourites} onClick={() => onFav(ad.id)} size='small'>
                  <StarPlus size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
                </IconButton>
              )}
              <IconButton
                aria-label={labels.markAsApplied}
                disabled={ad.applied}
                onClick={() => onApplied(ad.id)}
                size='small'
              >
                <MailCheck size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
              </IconButton>
            </>
          )}
        </ApolloTableCell>
      ) : null}
      <JobTitle>
        {zoom ? (
          <>
            {favIndicator}
            {appliedIndicator}
            {ad.title} {ad.employmentType === 'permanent' ? '[Perm]' : '[B2B]'} [{ad.workplaceType}]{' '}
            {favSkills.map(skillName => (
              <span key={skillName}>[{skillName}]</span>
            ))}
          </>
        ) : (
          <>
            {favIndicator}
            {appliedIndicator}
            {ad.title}
          </>
        )}
      </JobTitle>
      <Salary>
        {ad.monthlySalaryRangeAfterTaxes !== undefined ? (
          <ReadingValue displayValue={`${monthlySalaryFrom} — ${monthlySalaryTo}`} unit='kPLN' />
        ) : null}
      </Salary>
      {zoom ? (
        <Salary>
          {b2bHourlyRateEquivalent !== null ? (
            <ReadingValue displayValue={b2bHourlyRateEquivalent} unit='PLN/h' />
          ) : null}
        </Salary>
      ) : null}
    </ApolloTableRow>
  )
}
