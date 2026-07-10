import { Box, IconButton, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Pencil } from 'lucide-react'
import { type FC } from 'react'
import { metricValueSx, statusSx } from './styles'
import { SectionField } from './SectionField'

export const CardHeader: FC<Record<string, never>> = () => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 3,
      mb: 4,
    }}
  >
    <SectionField label='Status'>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: designTokens.components.statusDot.size,
            height: designTokens.components.statusDot.size,
            borderRadius: '50%',
            bgcolor: 'energy.main',
          }}
        />
        <Typography sx={statusSx}>Aktywny</Typography>
      </Box>
    </SectionField>

    <SectionField label='Taryfa energii' align='right'>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
      >
        <Typography sx={metricValueSx}>0,85 zł / kWh</Typography>
        <IconButton size='small' aria-label='Edytuj taryfę'>
          <Pencil size={designTokens.icon.sizeAction} />
        </IconButton>
      </Box>
    </SectionField>
  </Box>
)
