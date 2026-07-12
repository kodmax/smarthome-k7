import { Box, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { SectionLabel } from './SectionLabel'

type StatItemProps = {
  icon: FC<{ size?: number; strokeWidth?: number }>
  label: string
  value: string
}

const { statIcon, statsRow } = designTokens.components

export const StatItem: FC<StatItemProps> = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: `${statsRow.itemGap}px` }}>
    <Box
      sx={theme => ({
        width: statIcon.size,
        height: statIcon.size,
        borderRadius: '50%',
        bgcolor: `${theme.vars.palette.energy.main}18`,
        color: 'energy.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      })}
    >
      <Icon size={designTokens.icon.sizeLg} strokeWidth={designTokens.icon.strokeWidth} />
    </Box>
    <Box>
      <SectionLabel>{label}</SectionLabel>
      <Typography variant='metric'>{value}</Typography>
    </Box>
  </Box>
)
