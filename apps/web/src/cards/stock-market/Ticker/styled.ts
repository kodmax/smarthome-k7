import styled from '@emotion/styled'
import { designTokens } from '@repo/design-tokens'
import { TableCell } from '@mui/material'

const { success, danger } = designTokens.color

export const PriceChange = styled('span')<{ dir: 'up' | 'down' | 'none' }>(({ dir }) => ({
  color: dir === 'up' ? success : dir === 'down' ? danger : 'inherit',
  display: 'inline-block',
  width: '4em',
}))

export const Header = styled(TableCell)({
  fontSize: 'inherit',
})
