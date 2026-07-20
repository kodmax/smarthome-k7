import { Box, Typography } from '@mui/material'
import { type StyledLucideIcon } from '@repo/assets'
import { below2xlSideMenuScaleMediaQuery, designTokens, scaleBelow2xl } from '@repo/design-tokens'
import { type FC } from 'react'
import { pageHeaderLayout } from './pageHeaderLayout'

const { pageHeader } = designTokens.components
const { font, icon } = designTokens
const { titleRowGap } = pageHeaderLayout

type PageHeaderTitleRowProps = {
  title: string
  icon: StyledLucideIcon
  iconColor?: string
}

export const PageHeaderTitleRow: FC<PageHeaderTitleRowProps> = ({ title, icon: Icon, iconColor }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: `${titleRowGap}px`,
      mb: 0.75,
      [below2xlSideMenuScaleMediaQuery]: {
        gap: `${scaleBelow2xl(titleRowGap)}px`,
      },
    }}
  >
    <Box
      sx={{
        display: 'inline-flex',
        flexShrink: 0,
        lineHeight: 0,
        '& svg': {
          width: pageHeader.iconSize,
          height: pageHeader.iconSize,
          [below2xlSideMenuScaleMediaQuery]: {
            width: scaleBelow2xl(pageHeader.iconSize),
            height: scaleBelow2xl(pageHeader.iconSize),
          },
        },
      }}
    >
      <Icon size={pageHeader.iconSize} strokeWidth={icon.strokeWidth} color={iconColor} />
    </Box>
    <Typography
      component='h1'
      sx={{
        fontSize: font.h1.size,
        fontWeight: pageHeader.titleWeight,
        lineHeight: pageHeader.titleLineHeight,
        [below2xlSideMenuScaleMediaQuery]: {
          fontSize: scaleBelow2xl(font.h1.size),
        },
      }}
    >
      {title}
    </Typography>
  </Box>
)
