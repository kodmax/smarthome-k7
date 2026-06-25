import { FC } from 'react'
import { Data } from '../styled'
import LinkOpen from '../../../components/LinkOpen'
import { ZoomContext } from '../../../../apollo-card/ZoomCurtain'
import { TickerData } from '@repo/types'

export const Symbol: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return (
    <ZoomContext.Consumer>
      {zoom => (
        <Data>
          {ticker.symbol}
          {zoom.active ? <LinkOpen href={`https://finance.yahoo.com/quote/${ticker.symbol}/`} /> : null}
        </Data>
      )}
    </ZoomContext.Consumer>
  )
}
