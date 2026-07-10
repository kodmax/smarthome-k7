import { Box, IconButton, Typography } from '@mui/material'
import { Pencil } from 'lucide-react'
import { type FC } from 'react'
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
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: 'energy.main',
          }}
        />
        <Typography sx={{ color: 'energy.main', fontWeight: 700, fontSize: 18 }}>Aktywny</Typography>
      </Box>
    </SectionField>

    <SectionField label='Taryfa energii' align='right'>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>0,85 zł / kWh</Typography>
        <IconButton size='small' aria-label='Edytuj taryfę'>
          <Pencil size={16} />
        </IconButton>
      </Box>
    </SectionField>
  </Box>
)
