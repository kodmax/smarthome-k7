import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Zap } from 'lucide-react'
import { type FC } from 'react'
import { colorForValueInRange, type ColorIndicationRange } from '@/card-components'
import { BorderedPanel, fontSx, metricLgSx, SectionField } from './components'
import { formatNumber } from '@/helpers/formatNumber'
const currentPowerRange: ColorIndicationRange = { optimal: 400, lowest: 100, highest: 2400 }

export const CurrentPowerPanel: FC<{ currentPower: number; baselinePower: number }> = ({
  currentPower,
  baselinePower,
}) => {
  const adjustedPower = currentPower - baselinePower > 0 ? currentPower - baselinePower : 0

  return (
    <BorderedPanel>
      <SectionField label='Aktualna moc'>
        <Box sx={{ textAlign: 'center', mb: 3, mt: 3 }}>
          <Typography sx={metricLgSx} component='span'>
            {formatNumber(adjustedPower, { fractionDigits: 0 })} W{' '}
            <Typography component='span' sx={{ ...fontSx('h3'), color: 'text.secondary' }}>
              (+{formatNumber(baselinePower, { fractionDigits: 0 })} W)
            </Typography>
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Zap
              size={designTokens.icon.sizeLg}
              strokeWidth={1.5}
              color={colorForValueInRange(adjustedPower, currentPowerRange)}
              style={{ opacity: 0.85 }}
            />
          </Box>
        </Box>
      </SectionField>
    </BorderedPanel>
  )
}
