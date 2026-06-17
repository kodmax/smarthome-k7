import styled from '@emotion/styled'
import { TableCell } from '@mui/material'

export const PriceChange = styled('span')<{ dir: 'up' | 'down' | 'none' }>(({ dir }) => ({
  color: dir === 'up' ? '#037b66' : dir === 'down' ? '#d60a22' : 'inherit',
  display: 'inline-block',
  width: '4em',
}))

export const Data = styled(TableCell)({
  padding: 0,
})

export const Header = styled(TableCell)({
  padding: '16px 0',
})
