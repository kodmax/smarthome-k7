#!/usr/bin/node
import { knxSchema } from '@repo/knx-schema'
import { DPT_DateTime, KnxLink } from 'js-knx'
import { fileURLToPath } from 'node:url'
import { requireEnv } from '#config/env'

export async function clocksSync(knx: KnxLink): Promise<void> {
  const now = new Date()
  const date = now.toISOString().substring(0, 10)
  const time = now.toString().substring(16, 24)
  const schema = knxSchema.system.clock

  await knx.getDatapoint(schema.dateTime).write(DPT_DateTime.setDateTime(date, time, DPT_DateTime.isDST(now)))
  await knx.getDatapoint(schema.date).write(date)
  await knx.getDatapoint(schema.time).write(time)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const knx = new KnxLink(requireEnv('KNX_HOST'), { maxRetry: 5 })
  knx.on('error', err => console.error(err))
  knx.connect().then(async () => {
    try {
      await clocksSync(knx)
    } finally {
      await knx.disconnect()
    }

    process.exit(0)
  })
}
