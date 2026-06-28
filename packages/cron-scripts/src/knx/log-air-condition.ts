#!/usr/bin/node
import { knxSchema } from '@repo/knx-schema'
import { KnxLink } from 'js-knx'
import * as mariadb from 'mariadb'
import { dbConfig } from '#config/db'
import { requireEnv } from '#config/env'

const pool = mariadb.createPool(dbConfig())

KnxLink.connect(requireEnv('KNX_HOST'), { maxRetry: 3 }).then(async knx => {
  const db = await pool.getConnection()

  try {
    const schema = knxSchema.home
    const bathroomFloor = {
      temp: await knx.getDatapoint(schema.temp.bathroomFloor.reading).read(),
      state: await knx.getDatapoint(schema.heating.bathroom.floorHeating).read(),
    }
    const bathroom = {
      setpoint: await knx.getDatapoint(schema.temp.bathroom.setpoint).read(),
      temp: await knx.getDatapoint(schema.temp.bathroom.reading).read(),
      state: await knx.getDatapoint(schema.heating.bathroom.waterHeating).read(),
    }
    const livingroom = {
      setpoint: await knx.getDatapoint(schema.temp.livingRoom.setpoint).read(),
      temp: await knx.getDatapoint(schema.temp.livingRoom.reading).read(),
      state: await knx.getDatapoint(schema.heating.livingRoom.waterHeating).read(),
    }
    const bedroom = {
      setpoint: await knx.getDatapoint(schema.temp.bedroom.setpoint).read(),
      temp: await knx.getDatapoint(schema.temp.bedroom.reading).read(),
      state: await knx.getDatapoint(schema.heating.bedroom.waterHeating).read(),
    }

    const humidity = await knx.getDatapoint(schema.airQuality.humidity.reading).read()
    const dewPoint = await knx.getDatapoint(schema.airQuality.dewPoint.reading).read()
    const co2 = await knx.getDatapoint(schema.airQuality.co2.reading).read()

    await db.query(
      `insert into indoor_air_condition (
            bathroom_floor_temp,
            bathroom_floor_heating,
            bedroom_temp,
            bedroom_heating,
            bedroom_setpoint,
            livingroom_temp,
            livingroom_heating,
            livingroom_setpoint,
            bathroom_temp,
            bathroom_heating,
            bathroom_setpoint,
            dew_point,
            humidity,
            co2
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bathroomFloor.temp.value,
        bathroomFloor.state.value,
        bedroom.temp.value,
        bedroom.state.value,
        bedroom.setpoint.value,
        livingroom.temp.value,
        livingroom.state.value,
        livingroom.setpoint.value,
        bathroom.temp.value,
        bathroom.state.value,
        bathroom.setpoint.value,
        dewPoint.value,
        humidity.value,
        co2.value,
      ],
    )
  } finally {
    await knx.disconnect()
    await db.end()
  }

  process.exit(0)
})
