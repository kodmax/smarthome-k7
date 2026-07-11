import { Typography } from '@mui/material'
import { type FC, type ReactNode } from 'react'
import { sectionLabelSx } from './styles'

type SectionLabelProps = {
  children: ReactNode
}

export const SectionLabel: FC<SectionLabelProps> = ({ children }) => (
  <Typography sx={sectionLabelSx}>{children}</Typography>
)
