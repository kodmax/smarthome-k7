import { Box } from '@mui/material'
import { type FC, type ReactNode } from 'react'
import { SectionLabel } from './SectionLabel'

type SectionFieldProps = {
  label: string
  children: ReactNode
  align?: 'left' | 'right'
}

export const SectionField: FC<SectionFieldProps> = ({ label, children, align = 'left' }) => (
  <Box sx={{ textAlign: align === 'right' ? { xs: 'left', sm: 'right' } : 'left' }}>
    <SectionLabel>{label}</SectionLabel>
    {children}
  </Box>
)
