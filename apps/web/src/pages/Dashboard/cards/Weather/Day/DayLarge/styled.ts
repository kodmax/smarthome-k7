import styled from '@emotion/styled'
import { designTokens } from '@repo/design-tokens'

const { space } = designTokens

export const DayWrapper = styled('div')({
  flex: '0 0 calc(100% / 7)',
  display: 'flex',
  justifyContent: 'center',
  padding: `${space[2]}px ${space[2]}px 0`,
})
