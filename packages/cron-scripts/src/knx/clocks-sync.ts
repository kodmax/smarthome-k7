import { knxSchema } from '@repo/knx-schema'
import { DPT_DateTime, KnxLink } from 'js-knx'

export async function clocksSync(knx: KnxLink): Promise<void> {
  const now = new Date()
  const date = now.toISOString().substring(0, 10)
  const time = now.toString().substring(16, 24)
  const schema = knxSchema.system.clock

  await knx.group(schema.dateTime).write(DPT_DateTime.setDateTime(date, time, DPT_DateTime.isDST(now)))
  await knx.group(schema.date).write(date)
  await knx.group(schema.time).write(time)
}
