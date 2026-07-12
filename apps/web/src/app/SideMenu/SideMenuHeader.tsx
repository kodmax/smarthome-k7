import { Box, Typography } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { designTokens, scaleBelow2xl } from '@repo/design-tokens'
import { type FC } from 'react'

const { sideMenu } = designTokens.components
const { radius } = designTokens

const below2xl = (theme: Theme) => theme.breakpoints.down('2xl')

const headerSx = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  p: theme.spacing(3, 6, 5, 3),
  [below2xl(theme)]: {
    gap: theme.spacing(3),
    p: theme.spacing(4.5, 9, 7, 4.5),
  },
})

const logoSx = (theme: Theme) => ({
  width: sideMenu.logoSize,
  height: sideMenu.logoSize,
  borderRadius: `${radius.md}px`,
  bgcolor: 'background.default',
  border: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  [below2xl(theme)]: {
    width: scaleBelow2xl(sideMenu.logoSize),
    height: scaleBelow2xl(sideMenu.logoSize),
    borderRadius: `${scaleBelow2xl(radius.md)}px`,
  },
})

export const SideMenuHeader: FC<Record<string, never>> = () => (
  <Box sx={headerSx}>
    <Box sx={logoSx}>
      <Typography variant='sideMenuLogo'>K7</Typography>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant='sideMenuBrandTitle'>Smarthome</Typography>
      <Typography variant='sideMenuBrandSubtitle'>Dashboard</Typography>
    </Box>
  </Box>
)
