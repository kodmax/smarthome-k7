import { FC } from 'react'
import { ApolloTableCell, LinkOpen } from '@/card-components'
import { TickerData } from '@repo/types'
import styled from '@emotion/styled'

const Ticker = styled('strong')({
  fontWeight: 400,
})

export const Symbol: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return (
    <>
      <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} />
      <ApolloTableCell>
        <Ticker>{ticker.symbol}</Ticker>
      </ApolloTableCell>
    </>
  )
}
