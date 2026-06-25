import { FC } from 'react'
import { TickerData } from '@repo/types'
import { EarningsDate, EG, PE, Price, Symbol } from './cells'

export const Ticker: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return (
    <tr>
      <Symbol ticker={ticker} />
      <EarningsDate ticker={ticker} />
      <PE ticker={ticker} />
      <EG ticker={ticker} />
      <Price ticker={ticker} />
    </tr>
  )
}
