import LinkOpen from '../../components/LinkOpen'
import { FC } from 'react'
import { TickerDetails } from '../types'
import { MarketStatusIcon } from './MarketStatusIcon'
import { Price } from './Price'
import { Data } from './styled'

export const Ticker: FC<{ item: TickerDetails; zoom: boolean }> = ({ item, zoom }) => {
  const earningsDate = new Date(item.data.earningsDate.confirmed ?? item.data.earningsDate.estimated ?? '')
  const earningsDaysLeft = Math.ceil((earningsDate.getTime() - new Date().getTime()) / 86400000)

  const trailingPE =
    item.data.statistics.trailingEPS > 0 ? item.data.price.lastTradePrice / item.data.statistics.trailingEPS : undefined

  const forwardPE =
    item.data.statistics.forwardEPS !== null && item.data.statistics.forwardEPS > 0
      ? item.data.price.lastTradePrice / item.data.statistics.forwardEPS
      : undefined

  return (
    <tr>
      <Data>
        {item.data.ticker}
        {zoom ? <LinkOpen href={`https://finance.yahoo.com/quote/${item.data.ticker}/`} /> : null}
      </Data>
      {zoom ? (
        <>
          <Data sx={{ width: '7em' }}>{item.data.marketCap}</Data>
          <Data sx={{ width: '10em' }}>
            {earningsDaysLeft > 0 ? earningsDate.toLocaleDateString() : null}
            {earningsDaysLeft > 0 && earningsDaysLeft <= 30 ? <> ({earningsDaysLeft}d)</> : null}
          </Data>
          <Data sx={{ width: '7em' }}>
            {trailingPE !== undefined ? trailingPE.toFixed(0) : '--'} →{' '}
            {forwardPE !== undefined ? forwardPE.toFixed(0) : '--'}
          </Data>
        </>
      ) : null}
      <Data sx={{ width: '4em' }}>{item.eg.toFixed(0)}%</Data>
      <Data sx={{ width: '1em', textAlign: 'center' }}>
        <MarketStatusIcon marketStatus={item.data.exchange.status} />
      </Data>
      <Data sx={{ width: '10em' }}>
        <Price price={item.data.price} />
      </Data>
    </tr>
  )
}
