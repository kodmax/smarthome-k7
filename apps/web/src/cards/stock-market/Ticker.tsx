import LinkOpen from '../components/LinkOpen'
import { FC } from 'react'
import { TickerDetails } from './types'

export const Ticker: FC<{ item: TickerDetails; zoom: boolean }> = ({ item, zoom }) => {
  return (
    <tr>
      <td>
        {item.data.ticker}
        {zoom ? <LinkOpen href={`https://finance.yahoo.com/quote/${item.data.ticker}/`} /> : null}
      </td>
      <td style={{ width: '2em' }}>{item.data.daily.pe !== undefined ? Math.round(+item.data.daily.pe) : '-'}</td>
      <td style={{ width: '2em' }}>{item.eg.toFixed(0)}%</td>
      <td style={{ width: '4em' }}>{item.price}</td>
    </tr>
  )
}
