import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import { AiSparklesIcon, FavStarIcon, InfoIcon, LoaderIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { toSkillId } from '@repo/common'
import { JobAdArchiveReason, JobAdsFeedItem, JobApplyStatus, MySkillsFeed } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { Star } from 'lucide-react'
import { FC, useEffect, useMemo, useState, type CSSProperties, type SyntheticEvent } from 'react'
import { TagGroup } from '@/card-components'
import { CvPreviewDialog } from '@/pages/JobMarket/cards/Cv/CvPreviewDialog'
import { useLocale, useTranslations } from '@/i18n'
import { ApplyStatusIcon } from '../../../../../../shared-components'
import { applyArchiveReasonOptions, applyStatusTargetStatuses } from './applyStatusSelectOptions'
import { formatAppliedDaysAgo, formatNotApplicable } from './formatAppliedDaysAgo'
import { RequiredSkillTag } from './RequiredSkillTag'
import { JobAdDetailsActions } from './JobAdDetailsActions'
import { useCvMatchAnalysis } from './useCvMatchAnalysis'

const favIconSize = designTokens.icon.sizeMd
const actionButtonIconSize = 16
const emptySelection = ''

export type SaveApplicationState = {
  applyStatus: JobApplyStatus
  archiveReason?: JobAdArchiveReason
  comment: string
}

export type ChangeApplicationStatePayload = SaveApplicationState & {
  id: string
}

export const ApplicationStatusEditor: FC<{
  ad: JobAdsFeedItem
  onSave: (state: SaveApplicationState) => void
  onFav: (id: string) => void
  onUnfav: (id: string) => void
  onAnalyzeCvMatch: (id: string) => void
}> = ({ ad, onSave, onFav, onUnfav, onAnalyzeCvMatch }) => {
  const { t } = useTranslations()
  const { locale } = useLocale()
  const labels = t.dashboard.jobAds
  const currentStatus = ad.meta.application.status
  const currentArchiveReason = ad.meta.application.archiveReason
  const rejectedAt = ad.meta.application.rejectedAt
  const showRejectionDate = rejectedAt !== null
  const appliedDaysAgo = formatAppliedDaysAgo(ad.meta.application.appliedAt, locale)
  const rejectedDaysAgo = formatAppliedDaysAgo(rejectedAt, locale)
  const notApplicable = formatNotApplicable(locale)
  const savedComment = ad.meta.application.comment ?? ''
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [nextStatus, setNextStatus] = useState<JobApplyStatus | typeof emptySelection>(emptySelection)
  const [nextArchiveReason, setNextArchiveReason] = useState<JobAdArchiveReason | typeof emptySelection>(emptySelection)
  const [comment, setComment] = useState(savedComment)
  const [menuPaperStyle, setMenuPaperStyle] = useState<CSSProperties>()
  const targetStatuses = useMemo(
    () => applyStatusTargetStatuses(currentStatus, currentArchiveReason),
    [currentArchiveReason, currentStatus],
  )
  const archiveReasonOptions = useMemo(
    () => applyArchiveReasonOptions(currentStatus, currentArchiveReason),
    [currentArchiveReason, currentStatus],
  )
  const hasStatusOptions = targetStatuses.length > 0
  const showArchiveReasonSelect = nextStatus === 'archived'
  const hasValidStatusSelection =
    nextStatus !== emptySelection && (nextStatus !== 'archived' || nextArchiveReason !== emptySelection)
  const canSubmit = hasValidStatusSelection || comment.trim() !== savedComment.trim()
  const isTheProtocolAd = ad.content.origin === 'theprotocol'
  const isManualAd = ad.content.origin === 'manual'
  const canAnalyzeCvMatch = !isTheProtocolAd && !isManualAd && !ad.meta.isCurrentCVUsed
  const [theProtocolInfoOpen, setTheProtocolInfoOpen] = useState(false)
  const {
    analyzing: analyzingCvMatch,
    dialogOpen: matchAnalysisDialogOpen,
    dialogTitle: matchAnalysisTitle,
    dialogText: matchAnalysisText,
    dialogNotice: matchAnalysisNotice,
    closeDialog: closeMatchAnalysisDialog,
    requestAnalysis: handleAnalyzeCvMatch,
  } = useCvMatchAnalysis({
    ad,
    canAnalyze: canAnalyzeCvMatch,
    onAnalyze: onAnalyzeCvMatch,
    resetWhen: currentStatus,
  })
  const mySkillsFeed = useFeed<MySkillsFeed>('my-skills')

  const mySkillsById = useMemo(() => {
    return new Map(mySkillsFeed?.skills.map(skill => [skill.id, skill]) ?? [])
  }, [mySkillsFeed])

  const statusSelectMenuProps = useMemo(
    () => ({
      slotProps: {
        paper: {
          style: menuPaperStyle,
        },
      },
    }),
    [menuPaperStyle],
  )

  const currentStatusLabel =
    currentStatus === 'archived' && currentArchiveReason !== null
      ? labels.archiveReason[currentArchiveReason]
      : labels.applyStatus[currentStatus]

  useEffect(() => {
    setIsChangingStatus(false)
    setNextStatus(emptySelection)
    setNextArchiveReason(emptySelection)
    setComment(savedComment)
  }, [ad.content.id, currentArchiveReason, currentStatus, savedComment])

  const handleOpenEditor = () => {
    setComment(savedComment)
    setNextStatus(emptySelection)
    setNextArchiveReason(emptySelection)
    setIsChangingStatus(true)
  }

  const handleNextStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as JobApplyStatus | typeof emptySelection
    setNextStatus(value)
    if (value !== 'archived') {
      setNextArchiveReason(emptySelection)
    }
  }

  const handleNextArchiveReasonChange = (event: SelectChangeEvent<string>) => {
    setNextArchiveReason(event.target.value as JobAdArchiveReason)
  }

  const handleStatusSelectOpen = (event: SyntheticEvent) => {
    const width = (event.currentTarget as HTMLElement).getBoundingClientRect().width
    setMenuPaperStyle({ minWidth: width, width })
  }

  const handleSave = () => {
    if (!canSubmit) {
      return
    }

    if (nextStatus !== emptySelection) {
      if (nextStatus === 'archived') {
        if (nextArchiveReason === emptySelection) {
          return
        }

        onSave({
          applyStatus: 'archived',
          archiveReason: nextArchiveReason,
          comment: comment.trim(),
        })
        return
      }

      onSave({
        applyStatus: nextStatus,
        comment: comment.trim(),
      })
      return
    }

    onSave({
      applyStatus: currentStatus,
      archiveReason: currentArchiveReason ?? undefined,
      comment: comment.trim(),
    })
  }

  const handleCancelChange = () => {
    setIsChangingStatus(false)
    setNextStatus(emptySelection)
    setNextArchiveReason(emptySelection)
    setComment(savedComment)
  }

  const handleFavToggle = () => {
    if (ad.meta.fav) {
      onUnfav(ad.content.id)
      return
    }

    onFav(ad.content.id)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: `${designTokens.space[2]}px`,
        py: `${designTokens.space[1]}px`,
        fontSize: designTokens.font.body.size,
        alignItems: 'flex-start',
      }}
    >
      <IconButton
        aria-label={ad.meta.fav ? labels.removeFromFavourites : labels.addToFavourites}
        onClick={handleFavToggle}
        size='small'
        sx={{ mt: `${designTokens.space[1]}px` }}
      >
        {ad.meta.fav ? (
          <FavStarIcon size={favIconSize} strokeWidth={designTokens.icon.strokeWidth} glow='default' aria-hidden />
        ) : (
          <Star size={favIconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
        )}
      </IconButton>

      <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: `${designTokens.space[2]}px` }}>
        <Box>
          <Box sx={{ display: 'flex', gap: `${designTokens.space[3]}px`, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant='caption' color='text.secondary' display='block'>
                {labels.company}
              </Typography>
              <Typography>{ad.content.companyName}</Typography>
            </Box>
            <Box>
              <Typography variant='caption' color='text.secondary' display='block'>
                {labels.currentApplicationStatus}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: `${designTokens.space[1]}px` }}>
                {currentStatus !== 'pending-review' ? (
                  <ApplyStatusIcon status={currentStatus} archiveReason={currentArchiveReason} />
                ) : null}
                <Typography>{currentStatusLabel}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant='caption' color='text.secondary' display='block'>
                {labels.applicationDate}
              </Typography>
              <Typography>{appliedDaysAgo}</Typography>
            </Box>
            {showRejectionDate ? (
              <Box>
                <Typography variant='caption' color='text.secondary' display='block'>
                  {labels.rejectionDate}
                </Typography>
                <Typography>{rejectedDaysAgo}</Typography>
              </Box>
            ) : null}
          </Box>
          <Box sx={{ mt: `${designTokens.space[2]}px` }}>
            <Typography variant='caption' color='text.secondary' display='block'>
              {labels.requiredSkills}
            </Typography>
            {ad.content.requiredSkills.length > 0 ? (
              <TagGroup>
                {ad.content.requiredSkills.map(skill => (
                  <RequiredSkillTag key={skill} skill={skill} mySkill={mySkillsById.get(toSkillId(skill))} />
                ))}
              </TagGroup>
            ) : (
              <Typography variant='body2'>{notApplicable}</Typography>
            )}
          </Box>
          {ad.meta.application.comment !== null ? (
            <Box sx={{ mt: `${designTokens.space[2]}px` }}>
              <Typography variant='caption' color='text.secondary' display='block'>
                {labels.applicationComment}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {ad.meta.application.comment}
              </Typography>
            </Box>
          ) : null}
        </Box>

        {isChangingStatus ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${designTokens.space[5]}px`,
              mt: `${designTokens.space[3]}px`,
            }}
          >
            {hasStatusOptions ? (
              <FormControl
                size='small'
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    maxWidth: '100%',
                  },
                }}
              >
                <InputLabel id={`job-next-status-${ad.content.id}`} shrink>
                  {labels.newApplicationStatus}
                </InputLabel>
                <Select<string>
                  labelId={`job-next-status-${ad.content.id}`}
                  value={nextStatus}
                  label={labels.newApplicationStatus}
                  displayEmpty
                  onChange={handleNextStatusChange}
                  onOpen={handleStatusSelectOpen}
                  MenuProps={statusSelectMenuProps}
                >
                  {targetStatuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {labels.applyStatus[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            {showArchiveReasonSelect ? (
              <FormControl
                size='small'
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    maxWidth: '100%',
                  },
                }}
              >
                <InputLabel id={`job-archive-reason-${ad.content.id}`} shrink>
                  {labels.newArchiveReason}
                </InputLabel>
                <Select<string>
                  labelId={`job-archive-reason-${ad.content.id}`}
                  value={nextArchiveReason}
                  label={labels.newArchiveReason}
                  displayEmpty
                  onChange={handleNextArchiveReasonChange}
                  onOpen={handleStatusSelectOpen}
                  MenuProps={statusSelectMenuProps}
                >
                  {archiveReasonOptions.map(reason => (
                    <MenuItem key={reason} value={reason}>
                      {labels.archiveReason[reason]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            <TextField
              label={labels.applicationComment}
              InputLabelProps={{ shrink: true }}
              multiline
              minRows={2}
              value={comment}
              onChange={event => setComment(event.target.value)}
              size='small'
              fullWidth
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  maxWidth: '100%',
                },
                '& .MuiOutlinedInput-root.MuiInputBase-multiline': {
                  padding: `${designTokens.space[3]}px`,
                },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
                  padding: 0,
                  margin: 0,
                  boxSizing: 'border-box',
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: `${designTokens.space[1]}px`, justifyContent: 'flex-end' }}>
              <Button size='small' onClick={handleCancelChange}>
                {labels.cancel}
              </Button>
              <Button size='small' variant='contained' onClick={handleSave} disabled={!canSubmit}>
                {labels.save}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: `${designTokens.space[1]}px`, flexWrap: 'wrap' }}>
            <JobAdDetailsActions ad={ad} />
            {isTheProtocolAd ? (
              <Button
                size='small'
                variant='outlined'
                title={labels.cvMatchUnavailableTheProtocolTooltip}
                startIcon={
                  <InfoIcon size={actionButtonIconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
                }
                onClick={() => setTheProtocolInfoOpen(true)}
              >
                {labels.cvMatchUnavailableTheProtocol}
              </Button>
            ) : !isManualAd ? (
              <Button
                size='small'
                variant='outlined'
                startIcon={
                  analyzingCvMatch ? (
                    <LoaderIcon
                      spinning
                      size={actionButtonIconSize}
                      strokeWidth={designTokens.icon.strokeWidth}
                      aria-hidden
                    />
                  ) : (
                    <AiSparklesIcon
                      size={actionButtonIconSize}
                      strokeWidth={designTokens.icon.strokeWidth}
                      glow='soft'
                      aria-hidden
                    />
                  )
                }
                disabled={!canAnalyzeCvMatch || analyzingCvMatch}
                aria-busy={analyzingCvMatch}
                onClick={handleAnalyzeCvMatch}
              >
                {labels.checkCvMatch}
              </Button>
            ) : null}
            <Button size='small' variant='outlined' onClick={handleOpenEditor}>
              {labels.changeApplicationStatus}
            </Button>
          </Box>
        )}
      </Box>
      {isTheProtocolAd ? (
        <CvPreviewDialog
          open={theProtocolInfoOpen}
          onClose={() => setTheProtocolInfoOpen(false)}
          title={labels.cvMatchUnavailableTheProtocolTitle}
          text={labels.cvMatchUnavailableTheProtocolNotice}
        />
      ) : null}
      {matchAnalysisText !== null && matchAnalysisTitle !== null ? (
        <CvPreviewDialog
          open={matchAnalysisDialogOpen}
          onClose={closeMatchAnalysisDialog}
          title={matchAnalysisTitle}
          notice={matchAnalysisNotice}
          text={matchAnalysisText}
        />
      ) : null}
    </Box>
  )
}
