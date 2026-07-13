import { apolloCardRowHeight } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { Table, TableCell, TableRow, styled } from '@mui/material'

const { font } = designTokens

export const ApolloDataTable = styled(Table)(({ theme }) => ({
  borderSpacing: 0,
  width: '100%',
  fontSize: font.body.size,
  lineHeight: `${apolloCardRowHeight}px`,
  color: theme.vars.palette.text.primary,
}))

export const ApolloTableRow = styled(TableRow)({
  height: `${apolloCardRowHeight}px`,
})

export const ApolloTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none',
  lineHeight: 'inherit',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
  color: theme.vars.palette.text.primary,
  '&:not(.MuiTableCell-head)': {
    fontSize: 'inherit',
  },
}))

export const ApolloValueCell = styled(ApolloTableCell)({
  textAlign: 'right',
})

export default ApolloDataTable
