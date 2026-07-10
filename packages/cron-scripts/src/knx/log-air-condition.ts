import { knxSchema } from '@repo/knx-schema'
import { getDbPool } from '@repo/db'
import { KnxLink } from 'js-knx'

export async function logAirCondition(knx: KnxLink): Promise<void> {
  const db = await getDbPool().getConnection()

  try {
    const schema = knxSchema.home
    const [bathroomFloorTemp, bedroomTemp, livingroomTemp, bathroomTemp, humidity, dewPoint, co2] = await Promise.all([
      knx.group(schema.temp.bathroomFloor.reading).read(),
      knx.group(schema.temp.bedroom.reading).read(),
      knx.group(schema.temp.livingRoom.reading).read(),
      knx.group(schema.temp.bathroom.reading).read(),
      knx.group(schema.airQuality.humidity.reading).read(),
      knx.group(schema.airQuality.dewPoint.reading).read(),
      knx.group(schema.airQuality.co2.reading).read(),
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
      'insert into readings (timestamp, reading_name, reading_value) values (?, ?, ?)',
      readings.map(([reading_name, reading_value]) => [timestamp, reading_name, reading_value]),
    )
  } finally {
    await db.release()
  }
}
