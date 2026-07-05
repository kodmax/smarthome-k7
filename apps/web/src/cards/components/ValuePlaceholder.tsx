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
    <ApolloTableCell sx={{ color: 'text.disabled' }}>--</ApolloTableCell>
  </ApolloTableRow>
)

export default ValuePlaceholder
