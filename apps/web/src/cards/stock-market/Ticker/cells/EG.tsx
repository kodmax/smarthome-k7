import { FC } from 'react'
import { Data } from '../styled'
import { TickerData } from '@repo/types'

export const EG: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return <Data sx={{ fontFamily: 'monospace' }}>{ticker.price.eg !== null ? ticker.price.eg.toFixed(0) : '--'}%</Data>
}
