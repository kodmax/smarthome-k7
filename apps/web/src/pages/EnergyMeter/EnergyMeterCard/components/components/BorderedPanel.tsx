import { Box } from '@mui/material'
import { type FC, type ReactNode } from 'react'
import { borderedPanelSx } from './styles'

type BorderedPanelProps = {
  children: ReactNode
}

export const BorderedPanel: FC<BorderedPanelProps> = ({ children }) => <Box sx={borderedPanelSx}>{children}</Box>
