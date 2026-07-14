import { Box } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Children, type FC, type ReactNode } from 'react'

const { space } = designTokens

export const CardHeadingHints: FC<{ children: ReactNode }> = ({ children }) => {
  const items = Children.toArray(children).filter(Boolean)
  if (items.length === 0) {
    return null
  }

  return <Box sx={{ display: 'flex', alignItems: 'center', gap: space[1] }}>{items}</Box>
}
