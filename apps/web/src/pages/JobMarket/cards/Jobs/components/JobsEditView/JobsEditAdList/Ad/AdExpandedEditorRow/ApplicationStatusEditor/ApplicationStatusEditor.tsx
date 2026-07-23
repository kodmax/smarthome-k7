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
import { FavStarIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { toSkillId } from '@repo/common'
import { JobAdWithMeta, JobApplyStatus, MySkillsFeed } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { Star } from 'lucide-react'
import { FC, useEffect, useMemo, useState, type CSSProperties, type SyntheticEvent } from 'react'
import { TagGroup } from '@/card-components'
import { useLocale, useTranslations } from '@/i18n'
import { ApplyStatusIcon } from '../../../../../../shared-components'
import { applyStatusTargetOptions } from './applyStatusSelectOptions'
import { formatAppliedDaysAgo, formatNotApplicable } from './formatAppliedDaysAgo'
import { RequiredSkillTag } from './RequiredSkillTag'

const favIconSize = designTokens.icon.sizeMd
const emptyNextStatus = ''

export const ApplicationStatusEditor: FC<{
  ad: JobAdWithMeta
  onSave: (applyStatus: JobApplyStatus, comment: string) => void
  onFav: (id: string) => void
  onUnfav: (id: string) => void
}> = ({ ad, onSave, onFav, onUnfav }) => {
  const { t } = useTranslations()
  const { locale } = useLocale()
  const labels = t.dashboard.jobs
  const currentStatus = ad.meta.application.status
  const rejectedAt = ad.meta.application.rejectedAt
  const showRejectionDate = rejectedAt !== null
  const appliedDaysAgo = formatAppliedDaysAgo(ad.meta.application.appliedAt, locale)
  const rejectedDaysAgo = formatAppliedDaysAgo(rejectedAt, locale)
  const notApplicable = formatNotApplicable(locale)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [nextStatus, setNextStatus] = useState<JobApplyStatus | typeof emptyNextStatus>(emptyNextStatus)
  const [comment, setComment] = useState('')
  const [menuPaperStyle, setMenuPaperStyle] = useState<CSSProperties>()
  const targetStatusOptions = useMemo(() => applyStatusTargetOptions(currentStatus), [currentStatus])
  const canSubmit = nextStatus !== emptyNextStatus
  const canChangeStatus = targetStatusOptions.length > 0
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

  useEffect(() => {
    setIsChangingStatus(false)
    setNextStatus(emptyNextStatus)
    setComment('')
  }, [ad.id, currentStatus])

  const handleNextStatusChange = (event: SelectChangeEvent<JobApplyStatus | typeof emptyNextStatus>) => {
    setNextStatus(event.target.value as JobApplyStatus)
    setComment('')
  }

  const handleStatusSelectOpen = (event: SyntheticEvent) => {
    const width = (event.currentTarget as HTMLElement).getBoundingClientRect().width
    setMenuPaperStyle({ minWidth: width, width })
  }

  const handleSave = () => {
    if (!canSubmit) {
      return
    }

    onSave(nextStatus, comment.trim())
  }

  const handleCancelChange = () => {
    setIsChangingStatus(false)
    setNextStatus(emptyNextStatus)
    setComment('')
  }

  const handleFavToggle = () => {
    if (ad.meta.fav) {
      onUnfav(ad.id)
      return
    }

    onFav(ad.id)
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
              <Typography>{ad.companyName}</Typography>
            </Box>
            <Box>
              <Typography variant='caption' color='text.secondary' display='block'>
                {labels.currentApplicationStatus}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: `${designTokens.space[1]}px` }}>
                {currentStatus !== 'not-applied' ? <ApplyStatusIcon status={currentStatus} /> : null}
                <Typography>{labels.applyStatus[currentStatus]}</Typography>
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
            {ad.requiredSkills.length > 0 ? (
              <TagGroup>
                {ad.requiredSkills.map(skill => (
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
            <FormControl
              size='small'
              fullWidth
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  maxWidth: '100%',
                },
              }}
            >
              <InputLabel id={`job-next-status-${ad.id}`} shrink>
                {labels.newApplicationStatus}
              </InputLabel>
              <Select<JobApplyStatus | typeof emptyNextStatus>
                labelId={`job-next-status-${ad.id}`}
                value={nextStatus}
                label={labels.newApplicationStatus}
                displayEmpty
                onChange={handleNextStatusChange}
                onOpen={handleStatusSelectOpen}
                MenuProps={statusSelectMenuProps}
              >
                {targetStatusOptions.map(status => (
                  <MenuItem key={status} value={status}>
                    {labels.applyStatus[status]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={labels.applicationComment}
              InputLabelProps={{ shrink: true }}
              multiline
              minRows={2}
              value={comment}
              onChange={event => setComment(event.target.value)}
              size='small'
              fullWidth
              disabled={!canSubmit}
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  maxWidth: '100%',
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
        ) : canChangeStatus ? (
          <Box>
            <Button size='small' variant='outlined' onClick={() => setIsChangingStatus(true)}>
              {labels.changeApplicationStatus}
            </Button>
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
