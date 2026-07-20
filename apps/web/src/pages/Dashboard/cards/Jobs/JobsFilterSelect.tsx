import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { JOB_ADS_FILTER_ORDER, type JobAdsFilter } from './jobAdsFilter'

type Props = {
  value: JobAdsFilter
  onChange: (filter: JobAdsFilter) => void
}

export const JobsFilterSelect: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobs.filters

  const handleChange = (event: SelectChangeEvent<JobAdsFilter>) => {
    onChange(event.target.value as JobAdsFilter)
  }

  const filterLabels: Record<JobAdsFilter, string> = {
    new: labels.new,
    'in-progress': labels.inProgress,
    'not-interested': labels.notInterested,
    finished: labels.finished,
  }

  return (
    <FormControl size='small' sx={{ minWidth: 168 }}>
      <Select value={value} onChange={handleChange} aria-label={labels.label}>
        {JOB_ADS_FILTER_ORDER.map(filter => (
          <MenuItem key={filter} value={filter}>
            {filterLabels[filter]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
