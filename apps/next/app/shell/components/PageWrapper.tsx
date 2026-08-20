import { Box } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC, type ReactNode } from 'react'

type PageWrapperProps = {
  children: ReactNode
}

export const PageWrapper: FC<PageWrapperProps> = ({ children }) => (
  <Box sx={{ width: '100%', maxWidth: designTokens.layout.containerMax, mx: 'auto' }}>{children}</Box>
)
