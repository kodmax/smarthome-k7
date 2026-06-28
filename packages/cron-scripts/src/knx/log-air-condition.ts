#!/usr/bin/node
import { DPT_State, DPT_Value_AirQuality, DPT_Value_Humidity, DPT_Value_Temp, KnxLink } from 'js-knx'
import * as mariadb from 'mariadb'
import { dbConfig } from '#config/db'
import { requireEnv } from '#config/env'

const pool = mariadb.createPool(dbConfig())

KnxLink.connect(requireEnv('KNX_HOST'), { maxRetry: 3 }).then(async knx => {
  const db = await pool.getConnection()

  try {
    const bathroomFloor = {
      temp: await knx.getDatapoint({ address: '2/3/1', DataType: DPT_Value_Temp }).read(),
      state: await knx.getDatapoint({ address: '2/7/10', DataType: DPT_State }).read(),
    }
    const bathroom = {
      setpoint: await knx.getDatapoint({ address: '2/1/0', DataType: DPT_Value_Temp }).read(),
      temp: await knx.getDatapoint({ address: '2/3/8', DataType: DPT_Value_Temp }).read(),
      state: await knx.getDatapoint({ address: '2/7/7', DataType: DPT_State }).read(),
    }
    const livingroom = {
      setpoint: await knx.getDatapoint({ address: '2/0/0', DataType: DPT_Value_Temp }).read(),
      temp: await knx.getDatapoint({ address: '2/3/11', DataType: DPT_Value_Temp }).read(),
      state: await knx.getDatapoint({ address: '2/7/1', DataType: DPT_State }).read(),
    }
    const bedroom = {
      setpoint: await knx.getDatapoint({ address: '2/2/0', DataType: DPT_Value_Temp }).read(),
      temp: await knx.getDatapoint({ address: '2/3/9', DataType: DPT_Value_Temp }).read(),
      state: await knx.getDatapoint({ address: '2/7/5', DataType: DPT_State }).read(),
    }

    const humidity = await knx.getDatapoint({ address: '2/3/5', DataType: DPT_Value_Humidity }).read()
    const dewPoint = await knx.getDatapoint({ address: '2/3/10', DataType: DPT_Value_Temp }).read()
    const co2 = await knx.getDatapoint({ address: '2/3/3', DataType: DPT_Value_AirQuality }).read()

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
