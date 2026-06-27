import { FC, useContext } from 'react'
import { Data } from '../styled'
import LinkOpen from '../../../components/LinkOpen'
import { ZoomContext } from '@/apollo-card'
import { TickerData } from '@repo/types'

export const Symbol: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const zoom = useContext(ZoomContext)

  if (!zoom.active) {
    return null
  }

  return (
    <Data>
      {ticker.symbol}
      <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} />
    </Data>
  )
}
