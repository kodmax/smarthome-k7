import { Box, Typography } from '@mui/material'
import { type FC } from 'react'
import { MeterStatusDisplay, SectionField } from './components'
import { EnergyRates } from '@repo/types'
import { type MeterStatus } from '../../types'

export const CardHeader: FC<{ energyRates: EnergyRates; status: MeterStatus }> = ({ energyRates, status }) => {
  const grossPrice = (energyRates.distribution + energyRates.energy) * energyRates.vat

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
        <MeterStatusDisplay status={status} />
      </SectionField>

      <SectionField label='Taryfa energii' align='right'>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}
        >
          <Typography variant='metric'>
            {grossPrice !== undefined ? Number(grossPrice).toFixed(4).replace('.', ',') : '--'} zł / kWh
          </Typography>
        </Box>
      </SectionField>
    </Box>
  )
}
