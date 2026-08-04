import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ChevronDown } from 'lucide-react'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { isDefaultExpandedArchivedGroup, type ArchivedJobAdsGroup } from '../../../jobAdsFilter'
import { ApplyStatusIcon } from '../../../shared-components'
import type { ChangeApplicationStatePayload } from '../JobAdsEditAdList/Ad/AdExpandedEditorRow/ApplicationStatusEditor'
import { JobAdsEditAdList } from '../JobAdsEditAdList'

type Props = {
  groups: ArchivedJobAdsGroup[]
  zoom: boolean
  expandedAdId?: string | null
  onToggleExpand?: (id: string) => void
  onChangeApplicationState?: (payload: ChangeApplicationStatePayload) => void
  onFav?: (id: string) => void
  onUnfav?: (id: string) => void
  onAnalyzeCvMatch?: (id: string) => void
}

const sectionRowInsetLeft = designTokens.space[4]
const sectionRowInsetRight = designTokens.space[2]

export const JobAdsArchivedAdList: FC<Props> = ({
  groups,
  zoom,
  expandedAdId = null,
  onToggleExpand,
  onChangeApplicationState,
  onFav,
  onUnfav,
  onAnalyzeCvMatch,
}) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${designTokens.space[1]}px` }}>
      {groups.map(group => (
        <Accordion
          key={group.archiveReason}
          defaultExpanded={isDefaultExpandedArchivedGroup(group.archiveReason)}
          disableGutters
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            '&:before': {
              display: 'none',
            },
            '&.Mui-expanded': {
              margin: 0,
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              <ChevronDown size={designTokens.icon.sizeMd} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
            }
            sx={{
              flexDirection: 'row-reverse',
              minHeight: `${designTokens.space[8]}px`,
              px: `${designTokens.space[2]}px`,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&.Mui-expanded': {
                backgroundColor: 'transparent',
              },
              '& .MuiAccordionSummary-expandIconWrapper': {
                marginRight: `${designTokens.space[2]}px`,
                marginLeft: 0,
              },
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
                gap: `${designTokens.space[2]}px`,
                my: `${designTokens.space[1]}px`,
                marginLeft: 0,
              },
            }}
          >
            <ApplyStatusIcon status='archived' archiveReason={group.archiveReason} />
            <Typography component='span'>
              {labels.archiveReason[group.archiveReason]}{' '}
              <Typography component='span' color='text.secondary' variant='body2'>
                ({group.ads.length})
              </Typography>
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, overflow: 'hidden', backgroundColor: 'transparent' }}>
            <Box
              sx={{
                boxSizing: 'border-box',
                maxWidth: '100%',
                minWidth: 0,
                pl: `${sectionRowInsetLeft}px`,
                pr: `${sectionRowInsetRight}px`,
              }}
            >
              <JobAdsEditAdList
                ads={group.ads}
                zoom={zoom}
                showApplyStatusIndicator={false}
                expandedAdId={expandedAdId}
                onToggleExpand={onToggleExpand}
                onChangeApplicationState={onChangeApplicationState}
                onFav={onFav}
                onUnfav={onUnfav}
                onAnalyzeCvMatch={onAnalyzeCvMatch}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}
