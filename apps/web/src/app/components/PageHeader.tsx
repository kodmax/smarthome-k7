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
        <Icon size={32} strokeWidth={designTokens.icon.strokeWidth} color={iconColor} />
        <Typography
          component='h1'
          sx={{
            fontSize: { xs: 28, md: 36 },
            fontWeight: 700,
            lineHeight: 1.15,
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
