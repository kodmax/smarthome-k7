import { Box } from '@mui/material'
import { type FC, type ReactNode } from 'react'

type TableEmptyMessageProps = {
  children: ReactNode
}

const TableEmptyMessage: FC<TableEmptyMessageProps> = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'text.disabled',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </Box>
)

export default TableEmptyMessage
