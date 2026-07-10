import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { metricValueSx, statusSx } from './styles'
import { SectionField } from './SectionField'
import { EnergyRates } from '@repo/types'

export const CardHeader: FC<{ energyRates: EnergyRates | undefined }> = ({ energyRates }) => {
  const grossPrice =
    energyRates !== undefined ? (energyRates.distribution + energyRates.energy) * energyRates.vat : undefined

  return (
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
          <Typography sx={metricValueSx}>
            {grossPrice !== undefined ? Number(grossPrice).toFixed(4).replace('.', ',') : '--'} zł / kWh
          </Typography>
        </Box>
      </SectionField>
    </Box>
  )
}
