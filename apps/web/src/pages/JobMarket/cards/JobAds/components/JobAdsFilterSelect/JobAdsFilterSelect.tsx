import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { JOB_ADS_FILTER_ORDER, type JobAdsFilter } from '../../jobAdsFilter'

type Props = {
  value: JobAdsFilter
  onChange: (filter: JobAdsFilter) => void
}

export const JobAdsFilterSelect: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds

  const handleChange = (event: SelectChangeEvent<JobAdsFilter>) => {
    onChange(event.target.value as JobAdsFilter)
  }

  return (
    <FormControl size='small' sx={{ minWidth: 168 }}>
      <Select value={value} onChange={handleChange} aria-label={labels.filters.label}>
        {JOB_ADS_FILTER_ORDER.map(filter => (
          <MenuItem key={filter} value={filter}>
            {labels.applyStatus[filter]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
