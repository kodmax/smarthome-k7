import { Box, Slider, Typography } from '@mui/material'
import { useCommand } from '@repo/feed-client'
import { JobsFeed } from '@repo/types'
import { FC, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from '@/i18n'

type Props = {
  salaryRange: JobsFeed['salaryRange']
  acceptableSalary: JobsFeed['acceptableSalary']
}

export const AcceptableSalarySlider: FC<Props> = ({ salaryRange, acceptableSalary }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobs.acceptableSalary
  const setAcceptableSalary = useCommand('jobs', 'set-acceptable-salary')

  if (salaryRange === null) {
    return null
  }

  return (
    <AcceptableSalarySliderInner
      labels={labels}
      salaryRange={salaryRange}
      acceptableSalary={acceptableSalary}
      setAcceptableSalary={setAcceptableSalary}
    />
  )
}

type InnerProps = {
  labels: { label: string; ariaLabel: string; valueAtLeast: string }
  salaryRange: NonNullable<JobsFeed['salaryRange']>
  acceptableSalary: JobsFeed['acceptableSalary']
  setAcceptableSalary: (args: string) => void
}

const AcceptableSalarySliderInner: FC<InnerProps> = ({
  labels,
  salaryRange,
  acceptableSalary,
  setAcceptableSalary,
}) => {
  const committedValue = acceptableSalary ?? salaryRange.min
  const [value, setValue] = useState(committedValue)

  useEffect(() => {
    setValue(committedValue)
  }, [committedValue])

  const valueLabel = useMemo(
    () => labels.valueAtLeast.replace('{amount}', String(Math.round(value / 1000))),
    [labels.valueAtLeast, value],
  )

  const onChangeCommitted = useCallback(
    (_event: SyntheticEvent | Event, newValue: number | number[]) => {
      const next = Array.isArray(newValue) ? newValue[0] : newValue
      setAcceptableSalary(JSON.stringify({ value: next }))
    },
    [setAcceptableSalary],
  )

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flex: '0 0 auto' }}>
      <Typography variant='caption' component='span' sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
        {valueLabel}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', width: 72, flex: '0 0 auto' }}>
        <Slider
          id='acceptable-salary-slider'
          value={value}
          min={salaryRange.min}
          max={salaryRange.max}
          step={1000}
          onChange={(_event, newValue) => setValue(Array.isArray(newValue) ? newValue[0] : newValue)}
          onChangeCommitted={onChangeCommitted}
          aria-label={labels.ariaLabel}
          aria-valuetext={valueLabel}
          size='small'
          sx={{ width: '100%', py: 0, mt: 0.5 }}
        />
      </Box>
    </Box>
  )
}
