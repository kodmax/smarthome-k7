import { styled } from '@mui/material'
import { ApolloDataTable } from '@/card-components'

export const StockMarketTable = styled(ApolloDataTable)({
  '&& .MuiTableCell-root:last-of-type:not(:first-of-type)': {
    textAlign: 'left',
  },
})
