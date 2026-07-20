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
  <Box sx={{ mb: 3 }}>
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        mb: 0.75,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
        <Icon size={pageHeader.iconSize} strokeWidth={designTokens.icon.strokeWidth} color={iconColor} />
        <Typography
          component='h1'
          sx={{
            fontSize: { xs: designTokens.font.h2.size, md: designTokens.font.h1.size },
            fontWeight: pageHeader.titleWeight,
            lineHeight: pageHeader.titleLineHeight,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>

    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
      {description}
    </Typography>
  </Box>
)
