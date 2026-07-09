import { FC } from 'react'
import { ApolloTableCell, LinkOpen } from '@/card-components'
import { TickerData } from '@repo/types'
import styled from '@emotion/styled'

const Ticker = styled('strong')<{ zoom: boolean }>(({ zoom }) => ({
  fontWeight: zoom ? 500 : 400,
}))

export const Symbol: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  return (
    <>
      <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} />
      <ApolloTableCell>
        <Ticker zoom={zoom}>{ticker.symbol}</Ticker>
      </ApolloTableCell>
    </>
  )
}
