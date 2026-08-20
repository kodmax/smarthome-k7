import { FC } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { ChevronRightIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'

export const UserProfile: FC = () => (
  <Box
    sx={{
      mt: 2,
      px: 1.5,
      py: 1.25,
      borderRadius: `${designTokens.radius.md}px`,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
    }}
  >
    <Avatar
      sx={{
        width: 32,
        height: 32,
        bgcolor: 'action.hover',
        color: 'text.secondary',
        fontSize: designTokens.font.bodySmall.size,
        fontWeight: 600,
      }}
    >
      M
    </Avatar>
    <Typography sx={{ flex: 1, fontSize: designTokens.font.body.size, fontWeight: 500 }}>Marcin</Typography>
    <ChevronRightIcon size={designTokens.icon.sizeXs} strokeWidth={designTokens.icon.strokeWidth} />
  </Box>
)
