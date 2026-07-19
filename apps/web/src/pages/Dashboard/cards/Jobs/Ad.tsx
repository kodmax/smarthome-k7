import { IconButton } from '@mui/material'
import { FavStarIcon } from '@repo/assets'
import { JobAdWithMeta, JobApplyStatus } from '@repo/types'
import { ClipboardPen } from 'lucide-react'
import { FC, Fragment, useMemo } from 'react'
import { designTokens } from '@repo/design-tokens'
import { ApolloTableCell, ApolloTableRow, LinkOpen, ReadingValue } from '@/card-components'
import { useTranslations } from '@/i18n'
import { ApplicationStatusEditor } from './ApplicationStatusEditor'
import { ApplyStatusIndicator } from './ApplyStatusIndicator'
import { JobTitle, Salary } from './styled'
import { formatJobSalary } from './formatJobSalary'
import { isFavSkill } from './isFavSkill'

const iconSize = designTokens.icon.sizeXs - 4

export const Ad: FC<{
  ad: JobAdWithMeta
  zoom: boolean
  editMode: boolean
  expanded: boolean
  onToggleExpand: (id: string) => void
  onChangeApplicationState: (id: string, applyStatus: JobApplyStatus, comment: string) => void
  onFav: (id: string) => void
  onUnfav: (id: string) => void
}> = ({ ad, zoom, editMode, expanded, onToggleExpand, onChangeApplicationState, onFav, onUnfav }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobs
  const favSkills = useMemo(() => ad.requiredSkills.filter(isFavSkill), [ad])
  const { monthlySalaryFrom, monthlySalaryTo, b2bHourlyRateEquivalent } = useMemo(() => formatJobSalary(ad), [ad])
  const columnCount = zoom ? 4 : 2
  const favIndicator =
    !editMode && ad.meta.fav ? (
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
  const editButton =
    zoom && editMode ? (
      <IconButton
        aria-label={labels.editApplication}
        aria-expanded={expanded}
        onClick={() => onToggleExpand(ad.id)}
        size='small'
        sx={{
          mr: `${designTokens.space[1]}px`,
          verticalAlign: 'middle',
          p: 0,
        }}
      >
        <ClipboardPen size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
      </IconButton>
    ) : null

  return (
    <Fragment>
      <ApolloTableRow>
        {zoom ? <LinkOpen href={ad.advertUrl} /> : null}
        <JobTitle>
          {zoom ? (
            <>
              {favIndicator}
              <ApplyStatusIndicator ad={ad} />
              {editButton}
              {ad.title} {ad.employmentType === 'permanent' ? '[Perm]' : '[B2B]'} [{ad.workplaceType}]{' '}
              {favSkills.map(skillName => (
                <span key={skillName}>[{skillName}]</span>
              ))}
            </>
          ) : (
            <>
              {favIndicator}
              <ApplyStatusIndicator ad={ad} />
              {editButton}
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
      {zoom && editMode && expanded ? (
        <ApolloTableRow sx={{ height: 'auto' }}>
          <ApolloTableCell
            colSpan={columnCount}
            sx={{
              whiteSpace: 'normal',
              overflow: 'visible',
              textOverflow: 'clip',
              py: `${designTokens.space[1]}px`,
            }}
          >
            <ApplicationStatusEditor
              ad={ad}
              onSave={(applyStatus, comment) => onChangeApplicationState(ad.id, applyStatus, comment)}
              onFav={onFav}
              onUnfav={onUnfav}
            />
          </ApolloTableCell>
        </ApolloTableRow>
      ) : null}
    </Fragment>
  )
}
