import { Box, TableRow, Typography } from '@mui/material'
import { JobMarketPopularTechnology, MySkill, type SkillExperienceLevel } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC, Fragment } from 'react'
import { ApolloTableCell, ApolloValueCell } from '@/card-components'
import { formatNumber } from '@/helpers/formatNumber'
import { SkillEditButton } from './SkillEditButton'
import { SkillExperienceEditor } from './SkillExperienceEditor'
import { SkillLevelIndicator } from './SkillLevelIndicator'
import { TechnologyLogo } from './TechnologyLogo'

const columnCount = 6

const experienceCellSx = {
  width: 56,
  px: 0.5,
  textAlign: 'center',
  verticalAlign: 'middle',
} as const

type Props = {
  rank: number
  technology: JobMarketPopularTechnology
  editMode: boolean
  expanded: boolean
  mySkill: MySkill | undefined
  onToggleExpand: () => void
  onLevelChange: (level: SkillExperienceLevel) => void
  onCommentBlur: (comment: string) => void
}

export const Skill: FC<Props> = ({
  rank,
  technology,
  editMode,
  expanded,
  mySkill,
  onToggleExpand,
  onLevelChange,
  onCommentBlur,
}) => {
  return (
    <Fragment>
      <TableRow sx={{ height: 40 }}>
        <ApolloTableCell>{rank}</ApolloTableCell>
        <ApolloTableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <TechnologyLogo id={technology.id} name={technology.name} />
            <Typography variant='body2' noWrap sx={{ minWidth: 0 }}>
              {technology.name}
            </Typography>
          </Box>
        </ApolloTableCell>
        <ApolloTableCell sx={experienceCellSx}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
            {mySkill?.level ? <SkillLevelIndicator level={mySkill.level} comment={mySkill.comment} /> : null}
            {editMode ? <SkillEditButton expanded={expanded} onClick={onToggleExpand} /> : null}
          </Box>
        </ApolloTableCell>
        <ApolloValueCell>{formatNumber(technology.offersCount, { fractionDigits: 0 })}</ApolloValueCell>
        <ApolloValueCell>{`${technology.sharePercent}%`}</ApolloValueCell>
        <ApolloValueCell>
          {technology.medianSalary !== null
            ? `${formatNumber(technology.medianSalary, { fractionDigits: 0 })} zł`
            : '--'}
        </ApolloValueCell>
      </TableRow>
      {editMode && expanded ? (
        <TableRow>
          <ApolloTableCell colSpan={columnCount} sx={{ py: `${designTokens.space[2]}px` }}>
            <SkillExperienceEditor
              key={technology.id}
              level={mySkill?.level ?? null}
              initialComment={mySkill?.comment ?? ''}
              onLevelChange={onLevelChange}
              onCommentBlur={onCommentBlur}
            />
          </ApolloTableCell>
        </TableRow>
      ) : null}
    </Fragment>
  )
}
