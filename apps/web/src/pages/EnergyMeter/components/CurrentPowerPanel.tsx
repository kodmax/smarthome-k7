import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Zap } from 'lucide-react'
import { type FC } from 'react'
import { BorderedPanel } from './BorderedPanel'
import { metricLgSx } from './styles'
import { SectionField } from './SectionField'

export const CurrentPowerPanel: FC<Record<string, never>> = () => (
  <BorderedPanel>
    <SectionField label='Aktualna moc'>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography sx={metricLgSx}>132 W</Typography>
        <Box sx={{ mt: 1 }}>
          <Zap
            size={designTokens.icon.sizeLg}
            strokeWidth={1.5}
            color='var(--mui-palette-energy-main)'
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
