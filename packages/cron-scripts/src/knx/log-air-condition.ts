#!/usr/bin/node
import { knxSchema } from '@repo/knx-schema'
import { KnxLink } from 'js-knx'
import * as mariadb from 'mariadb'
import { fileURLToPath } from 'node:url'
import { dbConfig } from '#config/db'
import { requireEnv } from '#config/env'

const pool = mariadb.createPool(dbConfig())

export async function logAirCondition(knx: KnxLink): Promise<void> {
  const db = await pool.getConnection()

  try {
    const schema = knxSchema.home
    const [bathroomFloorTemp, bedroomTemp, livingroomTemp, bathroomTemp, humidity, dewPoint, co2] = await Promise.all([
      knx.getDatapoint(schema.temp.bathroomFloor.reading).read(),
      knx.getDatapoint(schema.temp.bedroom.reading).read(),
      knx.getDatapoint(schema.temp.livingRoom.reading).read(),
      knx.getDatapoint(schema.temp.bathroom.reading).read(),
      knx.getDatapoint(schema.airQuality.humidity.reading).read(),
      knx.getDatapoint(schema.airQuality.dewPoint.reading).read(),
      knx.getDatapoint(schema.airQuality.co2.reading).read(),
    ])

    const timestamp = new Date()
    const readings: Array<[string, number]> = [
      ['bathroom_floor_temp', bathroomFloorTemp.value],
      ['bedroom_temp', bedroomTemp.value],
      ['livingroom_temp', livingroomTemp.value],
      ['bathroom_temp', bathroomTemp.value],
      ['dew_point', dewPoint.value],
      ['humidity', humidity.value],
      ['co2', co2.value],
    ]

    await db.batch(
      'insert into indoor_readings (timestamp, reading_name, reading_value) values (?, ?, ?)',
      readings.map(([reading_name, reading_value]) => [timestamp, reading_name, reading_value]),
    )
  } finally {
    await db.end()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const knx = new KnxLink(requireEnv('KNX_HOST'), { maxRetry: 3 })
  knx.on('error', err => console.error(err))
  knx.connect().then(async () => {
    try {
      await logAirCondition(knx)
    } finally {
      await knx.disconnect()
    }

    process.exit(0)
  })
}
