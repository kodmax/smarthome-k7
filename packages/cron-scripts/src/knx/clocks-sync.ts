#!/usr/bin/node
import { DPT_Date, DPT_DateTime, DPT_Time, KnxLink } from 'js-knx'
import { requireEnv } from '#config/env'

KnxLink.connect(requireEnv('KNX_HOST'), { maxRetry: 5 }).then(async knx => {
  const now = new Date()
  const date = now.toISOString().substring(0, 10)
  const time = now.toString().substring(16, 24)

  await knx
    .getDatapoint({ address: '1/0/1', DataType: DPT_DateTime })
    .write(DPT_DateTime.setDateTime(date, time, DPT_DateTime.isDST(now)))
  await knx.getDatapoint({ address: '1/0/2', DataType: DPT_Date }).write(date)
  await knx.getDatapoint({ address: '1/0/3', DataType: DPT_Time }).write(time)

  await knx.disconnect()
  process.exit(0)
})
