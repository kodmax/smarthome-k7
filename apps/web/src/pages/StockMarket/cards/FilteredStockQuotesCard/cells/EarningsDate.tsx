import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { TickerData } from '@repo/types'

export const EarningsDate: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const earningsDate = new Date(ticker.earningsDate.confirmed ?? ticker.earningsDate.estimated ?? '')
  const earningsDaysLeft = Math.ceil((earningsDate.getTime() - new Date().getTime()) / 86400000)

  return (
    <ApolloTableCell>
      {earningsDaysLeft > 0 && earningsDaysLeft <= 30 ? <> {earningsDaysLeft}d</> : null}
    </ApolloTableCell>
  )
}
