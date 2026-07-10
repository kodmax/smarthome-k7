import { Box, Typography } from '@mui/material'
import { type StyledLucideIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'

type PageHeaderProps = {
  title: string
  description: string
  icon: StyledLucideIcon
  iconColor?: string
}

const { pageHeader } = designTokens.components

export const PageHeader: FC<PageHeaderProps> = ({ title, description, icon: Icon, iconColor }) => (
  <Box sx={{ mb: 4 }}>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        mb: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Icon size={pageHeader.iconSize} strokeWidth={designTokens.icon.strokeWidth} color={iconColor} />
        <Typography
          component='h1'
          sx={{
            fontSize: { xs: designTokens.font.h1.size, md: designTokens.font.display2.size },
            fontWeight: pageHeader.titleWeight,
            lineHeight: pageHeader.titleLineHeight,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>

    <Typography variant='body1' sx={{ color: 'text.secondary' }}>
      {description}
    </Typography>
  </Box>
)
