import { FC } from 'react'
import { Data } from '../styled'
import LinkOpen from '../../../components/LinkOpen'
import { TickerData } from '@repo/types'

export const Symbol: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  return (
    <Data>
      {ticker.symbol}
      <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} />
    </Data>
  )
}
