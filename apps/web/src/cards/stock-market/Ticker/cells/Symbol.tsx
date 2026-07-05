import { FC } from 'react'
import { ApolloTableCell, LinkOpen } from '@/card-components'
import { TickerData } from '@repo/types'
import styled from '@emotion/styled'

const Ticker = styled('strong')({
  fontWeight: 600,
})
export const Symbol: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  return (
    <ApolloTableCell>
      {zoom ? (
        <>
          <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} />{' '}
        </>
      ) : null}
      <Ticker>{ticker.symbol}</Ticker>
    </ApolloTableCell>
  )
}
