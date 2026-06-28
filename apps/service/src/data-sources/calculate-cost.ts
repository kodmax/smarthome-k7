import { EnergyRates } from '@repo/types'

const rates: EnergyRates = {
  added: 33.8,
  distribution: '0.16036',
  energy: '0.5376',
  vat: 1.23,
}

export const calculateCost = (energy: number): string => {
  return (energy * (+rates.distribution + +rates.energy)).toFixed(2)
}

export { rates as energyRates }
