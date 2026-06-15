import LinkOpen from '../components/LinkOpen'
import { FC } from 'react'
import { TickerDetails } from './types'
import { Circle } from '@mui/icons-material'

export const Ticker: FC<{ item: TickerDetails; zoom: boolean }> = ({ item, zoom }) => {
  const priceIcon =
    item.data.marketStatus === 'Open' ? (
      <Circle sx={{ fontSize: '1em', color: 'green' }} />
    ) : (
      <>{item.data.marketStatus}</>
    )
  //   <Bedtime sx={{ fontSize: '1em' }} />
  // ) : item.data.price.preMarket !== undefined ? (
  //   <WbSunny sx={{ fontSize: '1em' }} />
  // ) : (
  //   <Circle sx={{ fontSize: '1em', color: 'gray' }} />
  // )

  return (
    <tr>
      <td>
        {item.data.ticker}
        {zoom ? <LinkOpen href={`https://finance.yahoo.com/quote/${item.data.ticker}/`} /> : null}
      </td>
      <td style={{ width: '2em' }}>{item.eg.toFixed(0)}%</td>
      <td style={{ width: '1em', textAlign: 'right' }}>{priceIcon}</td>
      <td style={{ width: '3em', fontFamily: 'monospace' }}>{item.price}</td>
    </tr>
  )
}
