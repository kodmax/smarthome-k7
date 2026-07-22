import { Box, FormControl, InputLabel, MenuItem, Select, TextField, type SelectChangeEvent } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { FC, useEffect, useId, useState } from 'react'
import { useTranslations } from '@/i18n'
import { SKILL_EXPERIENCE_LEVEL_ORDER, type SkillExperienceLevel } from './skillExperienceLevel'

const emptyExperienceLevel = ''

type Props = {
  level: SkillExperienceLevel | null
  initialComment: string
  onLevelChange: (level: SkillExperienceLevel) => void
  onCommentBlur: (comment: string) => void
}

export const SkillExperienceEditor: FC<Props> = ({ level, initialComment, onLevelChange, onCommentBlur }) => {
  const { t } = useTranslations()
  const labels = t.jobMarket.popularTechnologies
  const levelLabelId = useId()
  const [comment, setComment] = useState(initialComment)

  useEffect(() => {
    setComment(initialComment)
  }, [initialComment])

  const handleLevelChange = (event: SelectChangeEvent<SkillExperienceLevel | typeof emptyExperienceLevel>) => {
    const next = event.target.value
    if (next === emptyExperienceLevel) {
      return
    }

    onLevelChange(next)
  }

  const handleCommentBlur = () => {
    if (level === null) {
      return
    }

    onCommentBlur(comment.trim())
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${designTokens.space[2]}px` }}>
      <FormControl size='small' fullWidth>
        <InputLabel id={levelLabelId} shrink>
          {labels.experienceLevelLabel}
        </InputLabel>
        <Select<SkillExperienceLevel | typeof emptyExperienceLevel>
          labelId={levelLabelId}
          value={level ?? emptyExperienceLevel}
          label={labels.experienceLevelLabel}
          displayEmpty
          onChange={handleLevelChange}
        >
          <MenuItem value={emptyExperienceLevel} disabled>
            {labels.experienceLevelPlaceholder}
          </MenuItem>
          {SKILL_EXPERIENCE_LEVEL_ORDER.map(item => (
            <MenuItem key={item} value={item}>
              {labels.experienceLevel[item]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label={labels.experienceComment}
        InputLabelProps={{ shrink: true }}
        multiline
        minRows={2}
        value={comment}
        onChange={event => setComment(event.target.value)}
        onBlur={handleCommentBlur}
        size='small'
        fullWidth
        disabled={level === null}
        sx={{
          '& .MuiOutlinedInput-notchedOutline legend': {
            maxWidth: '100%',
          },
        }}
      />
    </Box>
  )
}
