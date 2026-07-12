import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Zap } from 'lucide-react'
import { type FC } from 'react'
import { colorForValueInRange, type ColorIndicationRange } from '@/card-components'
import { useTranslations } from '@/i18n'
import { BorderedPanel, SectionField } from './components'
import { formatNumber } from '@/helpers/formatNumber'
const currentPowerRange: ColorIndicationRange = { optimal: 400, lowest: 100, highest: 2400 }

type Props = {
  currentPower: number
  baselinePower: number
  onBaselinePowerClick: () => void
  adjustMeterReading: boolean
}

export const CurrentPowerPanel: FC<Props> = ({
  currentPower,
  baselinePower,
  onBaselinePowerClick,
  adjustMeterReading,
}) => {
  const { t } = useTranslations()
  const labels = t.energyMeter.currentPower
  const adjustedPower = adjustMeterReading
    ? currentPower - baselinePower > 0
      ? currentPower - baselinePower
      : 0
    : currentPower

  return (
    <BorderedPanel>
      <SectionField label={labels.label}>
        <Box sx={{ textAlign: 'center', mb: 3, mt: 3 }}>
          <Typography variant='metricLg' component='span'>
            {formatNumber(adjustedPower, { fractionDigits: 0 })} W{' '}
            {adjustMeterReading ? (
              <Typography variant='metric' component='span' sx={{ color: 'text.secondary' }}>
                (+{formatNumber(baselinePower, { fractionDigits: 0 })} W)
              </Typography>
            ) : null}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Zap
              size={designTokens.icon.sizeLg}
              strokeWidth={1.5}
              color={colorForValueInRange(adjustedPower, currentPowerRange)}
              style={{ opacity: 0.85 }}
            />
          </Box>
        </Box>
      </SectionField>

      <FormControlLabel
        control={<Checkbox checked={adjustMeterReading} onClick={onBaselinePowerClick} />}
        label={
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {labels.subtractBaseline}
          </Typography>
        }
      />
    </BorderedPanel>
  )
}
