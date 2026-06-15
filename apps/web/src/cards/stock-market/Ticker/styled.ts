import styled from '@emotion/styled'

export const PriceChange = styled('span')<{ dir: 'up' | 'down' | 'none' }>(({ dir }) => ({
  color: dir === 'up' ? '#037b66' : dir === 'down' ? '#d60a22' : 'inherit',
}))
