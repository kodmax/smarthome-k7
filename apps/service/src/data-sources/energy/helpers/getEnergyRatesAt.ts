import { EnergyRates } from '@repo/types'
import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'

type EnergyRatesRow = {
  added: number
  distribution: number
  energy: number
  vat: number
}

export async function getEnergyRatesAt(db: Sql, at: string): Promise<EnergyRates | null> {
  const rows = await observeDbQuery(
    'select',
    'energy_rates',
    () =>
      db<EnergyRatesRow[]>`
      select added, distribution, energy, vat
      from energy_rates
      where effective_from <= ${at}
      order by effective_from desc
      limit 1
    `,
  )

  return rows[0] ?? null
}
