import styled from '@emotion/styled'
import { designTokens } from '@repo/design-tokens'

const { space } = designTokens

export const DayWrapper = styled('div')({
  flex: `0 0 calc(100% / 7 - ${space[1]}px)`,
  padding: `${space[1]}px ${space[1]}px 0`,
})
