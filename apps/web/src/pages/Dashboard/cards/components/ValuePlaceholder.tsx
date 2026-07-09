import { ReactNode, type FC } from 'react'
import { ApolloTableCell, ApolloTableRow, ApolloValueCell } from './ApolloDataTable'

type ValuePlaceholderProps = {
  label: ReactNode
}

const ValuePlaceholder: FC<ValuePlaceholderProps> = ({ label }) => (
  <ApolloTableRow>
    <ApolloTableCell>{label}</ApolloTableCell>
    <ApolloTableCell />
    <ApolloTableCell />
    <ApolloValueCell sx={{ color: 'text.disabled' }}>--</ApolloValueCell>
  </ApolloTableRow>
)

export default ValuePlaceholder
