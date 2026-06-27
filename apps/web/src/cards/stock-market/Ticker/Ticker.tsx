import { FC } from 'react'
import { TickerData } from '@repo/types'
import { EarningsDate, EG, PEAtPT, Price, Symbol } from './cells'

export const Ticker: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  return (
    <tr>
      <Symbol ticker={ticker} zoom={zoom} />
      <EarningsDate ticker={ticker} zoom={zoom} />
      <EG ticker={ticker} />
      <PEAtPT ticker={ticker} />
      <Price ticker={ticker} />
    </tr>
  )
}
