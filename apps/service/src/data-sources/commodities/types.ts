import { BtcPrice } from './btc'
import { CoalPrice } from './coal'
import { GoldPrice } from './gold'
import { InflationData } from './inflation'
import { NaturalGasPrice } from './natural-gas'
import { OilPrice } from './oil'

type History = Array<{
  datetime: string
  price: string
}>

type Commodities = {
  inflation: InflationData
  oil: OilPrice
  ng: NaturalGasPrice
  coal: CoalPrice
  gold: GoldPrice
  btc: BtcPrice
}

export type { History, Commodities }
