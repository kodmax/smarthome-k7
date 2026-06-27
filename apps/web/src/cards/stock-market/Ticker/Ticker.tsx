import { FC } from 'react'
import { TickerData } from '@repo/types'
import { EarningsDate, EG, PEAtPT, Price, Symbol } from './cells'

export const Ticker: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return (
    <tr>
      <Symbol ticker={ticker} />
      <EarningsDate ticker={ticker} />
      <EG ticker={ticker} />
      <PEAtPT ticker={ticker} />
      <Price ticker={ticker} />
    </tr>
  )
}
