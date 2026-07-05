import { designTokens } from '@repo/design-tokens'
import { Table, TableCell, TableRow, styled } from '@mui/material'

const { font } = designTokens

export const apolloDataTableRowHeight = font.body.size * font.body.lineHeight + 3

export const ApolloDataTable = styled(Table)(({ theme }) => ({
  borderSpacing: 0,
  width: '100%',
  fontSize: font.body.size,
  lineHeight: font.body.lineHeight,
  color: theme.vars.palette.text.primary,
}))

export const ApolloTableRow = styled(TableRow)({})

export const ApolloTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
  color: theme.vars.palette.text.primary,
  '&:last-of-type:not(:first-of-type)': {
    textAlign: 'right',
    color: theme.vars.palette.text.primary,
  },
}))

export default ApolloDataTable
