import { FC } from 'react'
import { ApolloTableCell, LinkOpen } from '@/card-components'
import { TickerData } from '@repo/types'

export const Symbol: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  return (
    <ApolloTableCell>
      {zoom ? (
        <>
          <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} />{' '}
        </>
      ) : null}
      {ticker.symbol}
    </ApolloTableCell>
  )
}
