import { Paper } from '@mui/material'
import { type FC, type ReactNode } from 'react'

type BorderedPanelProps = {
  children: ReactNode
}

export const BorderedPanel: FC<BorderedPanelProps> = ({ children }) => <Paper variant='panel'>{children}</Paper>
