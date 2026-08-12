import { Box, Slider, Typography } from '@mui/material'
import { useCommand } from '@repo/feed-client'
import {
  ACCEPTABLE_SALARY_SLIDER_MAX,
  ACCEPTABLE_SALARY_SLIDER_MIN,
  JobAdsFeed,
  type JobAdsSetAcceptableSalaryPayload,
} from '@repo/types'
import { FC, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from '@/i18n'

// MUI Slider still listens to mouse+touch; iOS Safari synthesizes mousedown/mouseup after a short
// drag and those ghost events reset the controlled value to the drag start (mui#31869).
const isIOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document))

const toSliderValue = (newValue: number | number[]): number => (Array.isArray(newValue) ? newValue[0] : newValue)

const clampSalary = (value: number): number =>
  Math.min(ACCEPTABLE_SALARY_SLIDER_MAX, Math.max(ACCEPTABLE_SALARY_SLIDER_MIN, value))

type Props = {
  acceptableSalary: JobAdsFeed['acceptableSalary']
}

export const AcceptableSalarySlider: FC<Props> = ({ acceptableSalary }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds.acceptableSalary
  const setAcceptableSalary = useCommand('job-ads', 'set-acceptable-salary')

  return (
    <AcceptableSalarySliderInner
      labels={labels}
      acceptableSalary={acceptableSalary}
      setAcceptableSalary={setAcceptableSalary}
    />
  )
}

type InnerProps = {
  labels: { label: string; ariaLabel: string; valueAtLeast: string }
  acceptableSalary: JobAdsFeed['acceptableSalary']
  setAcceptableSalary: (payload: JobAdsSetAcceptableSalaryPayload) => void
}

const AcceptableSalarySliderInner: FC<InnerProps> = ({ labels, acceptableSalary, setAcceptableSalary }) => {
  const committedValue = clampSalary(acceptableSalary ?? ACCEPTABLE_SALARY_SLIDER_MIN)
  const [value, setValue] = useState(committedValue)

  useEffect(() => {
    setValue(committedValue)
  }, [committedValue])

  const valueLabel = useMemo(
    () => labels.valueAtLeast.replace('{amount}', String(Math.round(value / 1000))),
    [labels.valueAtLeast, value],
  )

  const onChange = useCallback((_event: Event, newValue: number | number[]) => {
    if (isIOS && _event.type === 'mousedown') {
      return
    }

    setValue(toSliderValue(newValue))
  }, [])

  const onChangeCommitted = useCallback(
    (event: SyntheticEvent | Event, newValue: number | number[]) => {
      if (isIOS && event.type === 'mouseup') {
        return
      }

      const next = clampSalary(toSliderValue(newValue))
      setValue(next)
      setAcceptableSalary({ value: next })
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
          min={ACCEPTABLE_SALARY_SLIDER_MIN}
          max={ACCEPTABLE_SALARY_SLIDER_MAX}
          step={1000}
          onChange={onChange}
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
