import LinkOpen from '../../components/LinkOpen'
import { FC } from 'react'
import { TickerDetails } from '../types'
import { MarketStatusIcon } from './MarketStatusIcon'
import { Price } from './Price'

export const Ticker: FC<{ item: TickerDetails; zoom: boolean }> = ({ item, zoom }) => {
  return (
    <tr>
      <td>
        {item.data.ticker}
        {zoom ? <LinkOpen href={`https://finance.yahoo.com/quote/${item.data.ticker}/`} /> : null}
      </td>
      <td style={{ width: '2em' }}>{item.eg.toFixed(0)}%</td>
      <td style={{ width: '1em', textAlign: 'right' }}>
        <MarketStatusIcon marketStatus={item.data.marketStatus} />
      </td>
      <td style={{ width: '3em' }}>
        <Price price={item.data.price} />
      </td>
    </tr>
  )
}
