import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { SectionLabel } from './SectionLabel'

type StatItemProps = {
  icon: FC<{ size?: number; strokeWidth?: number }>
  label: string
  value: string
}

export const StatItem: FC<StatItemProps> = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: theme => `${theme.vars.palette.energy.main}18`,
        color: 'energy.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={22} strokeWidth={designTokens.icon.strokeWidth} />
    </Box>
    <Box>
      <SectionLabel>{label}</SectionLabel>
      <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{value}</Typography>
    </Box>
  </Box>
)
