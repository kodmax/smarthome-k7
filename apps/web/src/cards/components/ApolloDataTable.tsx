import { designTokens } from '@repo/design-tokens'
import { Table, TableCell, TableRow, styled } from '@mui/material'

const { color, font } = designTokens

export const apolloDataTableRowHeight = font.body.size * font.body.lineHeight + 3

export const ApolloDataTable = styled(Table)({
  borderSpacing: 0,
  width: '100%',
  fontSize: font.body.size,
  lineHeight: font.body.lineHeight,
  color: color.textPrimary,
})

export const ApolloTableRow = styled(TableRow)({})

export const ApolloTableCell = styled(TableCell)({
  borderBottom: 'none',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'middle',
  color: color.textPrimary,
  '&:last-of-type:not(:first-of-type)': {
    textAlign: 'right',
    color: color.textPrimary,
  },
})

export default ApolloDataTable
