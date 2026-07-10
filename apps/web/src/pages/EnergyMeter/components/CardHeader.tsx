import { Box, Typography } from '@mui/material'
import { type FC } from 'react'
import { metricValueSx } from './styles'
import { SectionField } from './SectionField'
import { EnergyRates } from '@repo/types'

export const CardHeader: FC<{ energyRates: EnergyRates }> = ({ energyRates }) => {
  const grossPrice = (energyRates.distribution + energyRates.energy) * energyRates.vat

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        gap: 3,
        mb: 4,
      }}
    >
      <SectionField label='Taryfa energii' align='right'>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
        >
          <Typography sx={metricValueSx}>{Number(grossPrice).toFixed(4).replace('.', ',')} zł / kWh</Typography>
        </Box>
      </SectionField>
    </Box>
  )
}
