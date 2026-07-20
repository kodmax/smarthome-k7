import { Box, Typography } from '@mui/material'
import { below2xlSideMenuScaleMediaQuery, scaleBelow2xl } from '@repo/design-tokens'
import { type FC } from 'react'
import { SideMenuOpenToggle } from '@/app/SideMenu/SideMenuOpenToggle'
import { PageHeaderTitleRow } from './PageHeaderTitleRow'
import { pageHeaderLayout } from './pageHeaderLayout'
import { type PageHeaderProps } from './types'

const { menuContentGap } = pageHeaderLayout

export const PageHeaderContent: FC<PageHeaderProps> = ({ title, description, icon, iconColor }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
    }}
  >
    <Box
      sx={{
        mr: `${menuContentGap}px`,
        [below2xlSideMenuScaleMediaQuery]: {
          mr: `${scaleBelow2xl(menuContentGap)}px`,
        },
      }}
    >
      <SideMenuOpenToggle />
    </Box>

    <Box sx={{ minWidth: 0, flex: 1 }}>
      <PageHeaderTitleRow title={title} icon={icon} iconColor={iconColor} />
      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Box>
  </Box>
)
