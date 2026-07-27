import { knxSchema } from '@repo/knx-schema'
import type { Logger } from '@repo/logger'
import { DPT_DateTime, KnxLink } from 'js-knx'

export async function clocksSync(knx: KnxLink, logger?: Logger): Promise<void> {
  const now = new Date()
  const date = now.toISOString().substring(0, 10)
  const time = now.toString().substring(16, 24)
  const schema = knxSchema.system.clock

  await knx.group(schema.dateTime).write(DPT_DateTime.setDateTime(date, time, DPT_DateTime.isDST(now)))
  await knx.group(schema.date).write(date)
  await knx.group(schema.time).write(time)

  logger?.info({ date, time }, 'KNX clocks synced')
}
