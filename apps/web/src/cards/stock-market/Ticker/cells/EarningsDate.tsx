import { FC, useContext } from 'react'
import { Data } from '../styled'
import { ZoomContext } from '../../../../apollo-card/ZoomCurtain'
import { TickerData } from '@repo/types'

export const EarningsDate: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const zoom = useContext(ZoomContext)

  if (!zoom.active) {
    return null
  }

  const earningsDate = new Date(ticker.earningsDate.confirmed ?? ticker.earningsDate.estimated ?? '')
  const earningsDaysLeft = Math.ceil((earningsDate.getTime() - new Date().getTime()) / 86400000)

  return (
    <Data>
      {earningsDaysLeft > 0 ? earningsDate.toLocaleDateString() : null}
      {earningsDaysLeft > 0 && earningsDaysLeft <= 30 ? <> ({earningsDaysLeft}d)</> : null}
    </Data>
  )
}
