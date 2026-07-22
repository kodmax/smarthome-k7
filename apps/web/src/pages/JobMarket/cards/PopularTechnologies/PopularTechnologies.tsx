import { Box, TableBody, TableHead, TableRow } from '@mui/material'
import { ListIcon, SettingsIcon } from '@repo/assets'
import { ApolloCardAction, BaseCard } from '@repo/apollo-card'
import { useCommand, useFeed } from '@repo/feed-client'
import { designTokens } from '@repo/design-tokens'
import { JobMarketInsightFeed, MySkillsFeed, type SkillExperienceLevel } from '@repo/types'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { ApolloDataTable, ApolloTableCell, ApolloValueCell, TablePlaceholder } from '@/card-components'
import { useTranslations } from '@/i18n'
import { Skill } from './Skill'

const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px`, color: 'text.secondary' } }

export const PopularTechnologies: FC<Record<string, never>> = () => {
  const [editMode, setEditMode] = useState(false)
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null)
  const { t } = useTranslations()
  const labels = t.jobMarket.popularTechnologies
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')
  const mySkillsFeed = useFeed<MySkillsFeed>('my-skills')
  const setSkill = useCommand('my-skills', 'set-skill')
  const setSkillComment = useCommand('my-skills', 'set-skill-comment')

  const skillsById = useMemo(() => {
    const map = new Map(mySkillsFeed?.skills.map(skill => [skill.id, skill]) ?? [])
    return map
  }, [mySkillsFeed])

  const onEditPreferences = useCallback(() => {
    setEditMode(current => !current)
  }, [])

  useEffect(() => {
    if (!editMode) {
      setExpandedSkillId(null)
    }
  }, [editMode])

  const onToggleSkillExpand = useCallback((skillId: string) => {
    setExpandedSkillId(current => (current === skillId ? null : skillId))
  }, [])

  const onLevelChange = useCallback(
    (id: string, name: string, level: SkillExperienceLevel) => {
      setSkill(JSON.stringify({ id, name, level }))
    },
    [setSkill],
  )

  const onCommentBlur = useCallback(
    (id: string, comment: string) => {
      setSkillComment(JSON.stringify({ id, comment }))
    },
    [setSkillComment],
  )

  return (
    <BaseCard
      cardId='job-market-popular-technologies'
      title={labels.title}
      icon={ListIcon}
      height={24}
      allowZoom={false}
      actions={
        <ApolloCardAction title={t.dashboard.common.editPreferences} onClick={onEditPreferences} Icon={SettingsIcon} />
      }
    >
      {feed === undefined ? (
        <TablePlaceholder rows={50} graph={false} value={true} />
      ) : (
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <ApolloDataTable sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={headerRowSx}>
                <ApolloTableCell sx={{ width: 24 }}>{labels.columns.rank}</ApolloTableCell>
                <ApolloTableCell>{labels.columns.technology}</ApolloTableCell>
                <ApolloTableCell sx={{ width: 56, px: 0.5, textAlign: 'center' }}>
                  {labels.columns.experience}
                </ApolloTableCell>
                <ApolloValueCell sx={{ width: 48 }}>{labels.columns.offers}</ApolloValueCell>
                <ApolloValueCell sx={{ width: 48 }}>{labels.columns.share}</ApolloValueCell>
                <ApolloValueCell sx={{ width: 80 }}>{labels.columns.median}</ApolloValueCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {feed.popularTechnologies.map((technology, index) => (
                <Skill
                  key={technology.id}
                  rank={index + 1}
                  technology={technology}
                  editMode={editMode}
                  expanded={expandedSkillId === technology.id}
                  mySkill={skillsById.get(technology.id)}
                  onToggleExpand={() => onToggleSkillExpand(technology.id)}
                  onLevelChange={level => onLevelChange(technology.id, technology.name, level)}
                  onCommentBlur={comment => onCommentBlur(technology.id, comment)}
                />
              ))}
            </TableBody>
          </ApolloDataTable>
        </Box>
      )}
    </BaseCard>
  )
}
