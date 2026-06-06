import { KnxReading } from 'js-knx'

export type EnergyRates = {
  added: number
  distribution: string
  energy: string
  vat: number
}

export interface EnergyHourConsumption {
  hourly_consumption: number
  hour: string
}

export interface EnergyReading {
  total: {
    adjusted: number
    target: string
    source: string
    text: string
    unit: string
    value: number
  }
  today: {
    value: number
    bars: EnergyHourConsumption[]
  }
  cost: {
    datetime: string
    rates: EnergyRates
    avg: number
  }
  instant: KnxReading<number>
  meter: KnxReading<number>
}
