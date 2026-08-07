import { Autocomplete, Chip, FormControl, TextField } from '@mui/material'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { dedupeSkillsById } from '../../requiredSkills'

type Props = {
  options: string[]
  value: string[]
  onChange: (skills: string[]) => void
}

export const JobAdsSkillsFilter: FC<Props> = ({ options, value, onChange }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds.filters

  return (
    <FormControl size='small' sx={{ minWidth: 200, maxWidth: 320 }}>
      <Autocomplete
        multiple
        size='small'
        options={options}
        value={value}
        onChange={(_, nextValue) => onChange(dedupeSkillsById(nextValue))}
        renderValue={(selected, getTagProps) =>
          selected.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index })
            return <Chip key={key} label={option} size='small' {...tagProps} />
          })
        }
        renderInput={params => (
          <TextField
            {...params}
            label={labels.skillsLabel}
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                'aria-label': labels.skillsLabel,
              },
            }}
          />
        )}
      />
    </FormControl>
  )
}
