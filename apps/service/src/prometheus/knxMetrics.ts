import { Counter, register } from 'prom-client'
import { isMetricsEnabled } from './metricsEnabled'

const knxReadTimeoutTotal = new Counter({
  name: 'apollo_daemon_knx_read_timeout_total',
  help: 'Total KNX group read timeouts',
  labelNames: ['group_address'],
  registers: [register],
})

export const incKnxReadTimeout = (groupAddress: string): void => {
  if (!isMetricsEnabled()) {
    return
  }

  knxReadTimeoutTotal.inc({ group_address: groupAddress })
}
