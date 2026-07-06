#!/usr/bin/node
import { knxSchema } from '@repo/knx-schema'
import { KnxLink } from 'js-knx'
import * as mariadb from 'mariadb'
import { fileURLToPath } from 'node:url'
import { dbConfig } from '#config/db'
import { requireEnv } from '#config/env'

export async function logDailyConsumption(knx: KnxLink): Promise<void> {
  const db = await mariadb.createConnection(dbConfig())

  try {
    const lastReading = await db.query(
      'select date, total_reading from daily_energy_readings order by date desc limit 1',
    )

    if (lastReading.length < 1) {
      throw new Error('Missing yesterdays entry')
    }

    const total = await knx.getDatapoint(knxSchema.home.energy.consumption.meterTotalReading).read()
    const consumption = total.value - lastReading[0].total_reading

    await db.query('insert into daily_energy_readings (date, total_reading, daily_consumption) values (?, ?, ?)', [
      new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60_000 - 3_600_000)
        .toISOString()
        .substring(0, 10),
      total.value,
      consumption,
    ])
  } finally {
    await db.end()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const knx = new KnxLink(requireEnv('KNX_HOST'), { maxRetry: 5 })
  knx.on('error', err => console.error(err))
  knx.connect().then(async () => {
    try {
      await logDailyConsumption(knx)
    } finally {
      await knx.disconnect()
    }

    process.exit(0)
  })
}
