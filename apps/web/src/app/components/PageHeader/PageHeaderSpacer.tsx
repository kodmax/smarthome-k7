import { Box } from '@mui/material'
import { type FC } from 'react'
import { pageHeaderLayout } from './pageHeaderLayout'

const { bodyPadding } = pageHeaderLayout

type PageHeaderSpacerProps = {
  height: number
}

export const PageHeaderSpacer: FC<PageHeaderSpacerProps> = ({ height }) => (
  <Box
    aria-hidden
    sx={{
      height: height > 0 ? `${height}px` : undefined,
      mt: `-${bodyPadding.top}px`,
      mb: 3,
    }}
  />
)
