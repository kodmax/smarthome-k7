import { styled } from '@mui/material'
import { TableCell } from '@mui/material'

export const PriceChange = styled('span')<{ dir: 'up' | 'down' | 'none' }>(({ theme, dir }) => ({
  color: dir === 'up' ? theme.vars.palette.success.main : dir === 'down' ? theme.vars.palette.error.main : 'inherit',
  display: 'inline-block',
  width: '4em',
}))

export const Header = styled(TableCell)({
  fontSize: 'inherit',
})
