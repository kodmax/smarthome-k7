import { EnergyRates } from '@repo/types'
import type { PoolConnection } from 'mariadb'
import { observeDbQuery } from '@/prometheus/dbMetrics'

type EnergyRatesRow = {
  added: number
  distribution: number
  energy: number
  vat: number
}

export async function getEnergyRatesAt(conn: PoolConnection, at: string): Promise<EnergyRates | null> {
  const rows = (await observeDbQuery('select', 'energy_rates', () =>
    conn.query(
      `select added, distribution, energy, vat
       from energy_rates
       where effective_from <= ?
       order by effective_from desc
       limit 1`,
      [at],
    ),
  )) as EnergyRatesRow[]

  return rows[0] ?? null
}
