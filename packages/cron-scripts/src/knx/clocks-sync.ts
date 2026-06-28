#!/usr/bin/node
import { knxSchema } from '@repo/knx-schema'
import { DPT_DateTime, KnxLink } from 'js-knx'
import { requireEnv } from '#config/env'

KnxLink.connect(requireEnv('KNX_HOST'), { maxRetry: 5 }).then(async knx => {
  const now = new Date()
  const date = now.toISOString().substring(0, 10)
  const time = now.toString().substring(16, 24)
  const schema = knxSchema.system.clock

  await knx.getDatapoint(schema.dateTime).write(DPT_DateTime.setDateTime(date, time, DPT_DateTime.isDST(now)))
  await knx.getDatapoint(schema.date).write(date)
  await knx.getDatapoint(schema.time).write(time)

  await knx.disconnect()
  process.exit(0)
})
