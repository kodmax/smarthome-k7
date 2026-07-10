import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import { Zap } from 'lucide-react'
import { type FC } from 'react'
import { BorderedPanel } from './BorderedPanel'
import { SectionField } from './SectionField'

export const CurrentPowerPanel: FC<Record<string, never>> = () => (
  <BorderedPanel>
    <SectionField label='Aktualna moc'>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography sx={{ color: 'energy.main', fontSize: 40, fontWeight: 700, lineHeight: 1 }}>132 W</Typography>
        <Box sx={{ mt: 1 }}>
          <Zap size={32} strokeWidth={1.5} color='var(--mui-palette-energy-main)' style={{ opacity: 0.85 }} />
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
