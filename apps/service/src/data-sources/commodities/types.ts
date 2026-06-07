import { PriceHistory } from '@repo/types'
import { BtcPrice } from './btc'
import { CoalPrice } from './coal'
import { GoldPrice } from './gold'
import { InflationData } from './inflation'
import { NaturalGasPrice } from './natural-gas'
import { OilPrice } from './oil'

export type WithHistory<T extends object> = T & {
  history: PriceHistory[]
}

export type Commodities = {
  inflation: InflationData
  oil: WithHistory<OilPrice>
  ng: WithHistory<NaturalGasPrice>
  coal: WithHistory<CoalPrice>
  gold: WithHistory<GoldPrice>
  btc: WithHistory<BtcPrice>
}
