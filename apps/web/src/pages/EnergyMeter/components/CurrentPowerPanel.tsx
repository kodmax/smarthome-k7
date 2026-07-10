import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Zap } from 'lucide-react'
import { type FC } from 'react'
import { colorForValueInRange, type ColorIndicationRange } from '@/card-components'
import { BorderedPanel } from './BorderedPanel'
import { metricLgSx } from './styles'
import { SectionField } from './SectionField'
const currentPowerRange: ColorIndicationRange = { optimal: 400, lowest: 100, highest: 2400 }

export const CurrentPowerPanel: FC<{ currentPower: number }> = ({ currentPower }) => (
  <BorderedPanel>
    <SectionField label='Aktualna moc'>
      <Box sx={{ textAlign: 'center', mb: 3, mt: 3 }}>
        <Typography sx={metricLgSx}>{currentPower?.toFixed(0) ?? '--'} W</Typography>
        <Box sx={{ mt: 1 }}>
          <Zap
            size={designTokens.icon.sizeLg}
            strokeWidth={1.5}
            color={
              currentPower !== undefined
                ? colorForValueInRange(currentPower, currentPowerRange)
                : 'var(--mui-palette-energy-main)'
            }
            style={{ opacity: 0.85 }}
          />
        </Box>
      </Box>
    </SectionField>

    <FormControlLabel
      control={<Checkbox defaultChecked={false} />}
      label={
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          Nie uwzględniaj w pomiarze
        </Typography>
      }
    />
  </BorderedPanel>
)
