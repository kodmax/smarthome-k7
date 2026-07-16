import { FC } from 'react'
import { TickerData } from '@repo/types'
import { EarningsDate, EG, PE, PEAtPT, PriceTarget, Quote, Symbol } from './cells'
import { TableRow } from '@mui/material'

export const Ticker: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  return (
    <TableRow>
      <Symbol ticker={ticker} zoom={zoom} />
      <EarningsDate ticker={ticker} zoom={zoom} />
      <PE ticker={ticker} zoom={zoom} />
      <EG ticker={ticker} />
      <PriceTarget ticker={ticker} zoom={zoom} />
      <PEAtPT ticker={ticker} />
      <Quote ticker={ticker} />
    </TableRow>
  )
}
