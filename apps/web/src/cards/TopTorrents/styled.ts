import { ApolloDataTable } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import styled from '@emotion/styled'

export const TorrentsTable = styled(ApolloDataTable)({
  tableLayout: 'fixed',
  fontSize: designTokens.font.body.size,
})
