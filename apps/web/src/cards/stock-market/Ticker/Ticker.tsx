import LinkOpen from '../../components/LinkOpen'
import { FC } from 'react'
import { MarketStatusIcon } from './MarketStatusIcon'
import { Price } from './Price'
import { Data } from './styled'
import { TickerData } from '@repo/types'
import { useTickerDetails } from './useTickerDetails'

export const Ticker: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  const details = useTickerDetails(ticker)

  return (
    <tr>
      <Data>
        {ticker.symbol}
        {zoom ? <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} /> : null}
      </Data>
      {zoom ? (
        <>
          <Data sx={{ width: '4em', fontFamily: 'monospace', textAlign: 'right', padding: '0 32px' }}>
            {Math.round(ticker.marketCap)}
          </Data>
          <Data sx={{ width: '10em' }}>
            {details.earningsDaysLeft > 0 ? details.earningsDate.toLocaleDateString() : null}
            {details.earningsDaysLeft > 0 && details.earningsDaysLeft <= 30 ? (
              <> ({details.earningsDaysLeft}d)</>
            ) : null}
          </Data>
          <Data sx={{ width: '7em' }}>
            {details.trailingPE !== null ? details.trailingPE.toFixed(0) : '--'} →{' '}
            {details.forwardPEAtPriceTarget !== null ? details.forwardPEAtPriceTarget.toFixed(0) : '--'}{' '}
          </Data>
        </>
      ) : null}
      <Data sx={{ width: '4em' }}>
        {ticker.price.eg !== null ? ticker.price.eg.toFixed(0) : '--'}% (
        {ticker.price.priceTarget !== null ? ticker.price.priceTarget.toFixed(2) : '--'}
        {' / '}
        {details.trailingPEAtPriceTarget !== null ? details.trailingPEAtPriceTarget.toFixed(0) : '--'})
      </Data>
      <Data sx={{ width: '1em', textAlign: 'center', paddingRight: 0 }}>
        <MarketStatusIcon marketStatus={ticker.exchange.status} />
      </Data>
      <Data sx={{ width: '8em' }}>
        <Price price={ticker.price} />
      </Data>
    </tr>
  )
}
