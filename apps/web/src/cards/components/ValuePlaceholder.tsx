import { designTokens } from '@repo/design-tokens'
import { ReactNode, type FC } from 'react'
import { ApolloTableCell, ApolloTableRow } from './ApolloDataTable'

type ValuePlaceholderProps = {
  label: ReactNode
}

const ValuePlaceholder: FC<ValuePlaceholderProps> = ({ label }) => (
  <ApolloTableRow>
    <ApolloTableCell>{label}</ApolloTableCell>
    <ApolloTableCell />
    <ApolloTableCell />
    <ApolloTableCell sx={{ color: designTokens.color.textMuted }}>--</ApolloTableCell>
  </ApolloTableRow>
)

export default ValuePlaceholder
