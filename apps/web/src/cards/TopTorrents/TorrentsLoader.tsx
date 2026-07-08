import { Box, CircularProgress } from '@mui/material'
import { type FC } from 'react'

export const TorrentsLoader: FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
    <CircularProgress size={32} />
  </Box>
)
