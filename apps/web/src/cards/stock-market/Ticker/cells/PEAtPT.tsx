import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { TickerData } from '@repo/types'
import { calcPEAtPT } from './calcPEAtPT'
import { styled } from '@mui/material'

const Muted = styled('span')(({ theme }) => ({
  color: theme.vars.palette.text.disabled,
}))

export const PEAtPT: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const { trailingPEAtPriceTarget, forwardPEAtPriceTarget } = calcPEAtPT(ticker)

  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
      {trailingPEAtPriceTarget !== null ? trailingPEAtPriceTarget.toFixed(0) : <Muted>--</Muted>}
      <Muted>{' → '}</Muted>
      {forwardPEAtPriceTarget !== null ? forwardPEAtPriceTarget.toFixed(0) : <Muted>--</Muted>}
    </ApolloTableCell>
  )
}
