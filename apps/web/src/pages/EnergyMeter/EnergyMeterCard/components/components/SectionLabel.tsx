import { Typography } from '@mui/material'
import { type FC, type ReactNode } from 'react'

type SectionLabelProps = {
  children: ReactNode
}

export const SectionLabel: FC<SectionLabelProps> = ({ children }) => (
  <Typography variant='sectionLabel' sx={{ mb: 1 }}>
    {children}
  </Typography>
)
