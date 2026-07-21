import { FC } from 'react'
import { TickerData } from '@repo/types'
import { PE, Quote, Symbol, Change } from './cells'
import { TableRow } from '@mui/material'
import { ColumnContent } from '../types'

export const Ticker: FC<{ ticker: TickerData; CustomColumnContent: ColumnContent }> = ({
  ticker,
  CustomColumnContent,
}) => {
  return (
    <TableRow>
      <Symbol ticker={ticker} />
      <CustomColumnContent ticker={ticker} />
      <PE ticker={ticker} />
      <Quote ticker={ticker} />
      <Change ticker={ticker} />
    </TableRow>
  )
}
