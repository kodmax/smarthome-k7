import { energyRates } from './energyRates'

export const calculateCost = (energy: number): string => {
  return (energy * (+energyRates.distribution + +energyRates.energy)).toFixed(2)
}
