import type { FeedEvents } from '@repo/feeds'
import { Counter, Gauge, register } from 'prom-client'
import { isMetricsEnabled } from './metricsEnabled'

const wsClientsConnected = new Gauge({
  name: 'apollo_daemon_ws_clients_connected',
  help: 'Number of connected WebSocket clients',
  registers: [register],
})

const wsCommandsTotal = new Counter({
  name: 'apollo_daemon_ws_commands_total',
  help: 'Total WebSocket commands received by the service',
  labelNames: ['source', 'command'],
  registers: [register],
})

export const registerWsMetrics = (vent: FeedEvents): void => {
  if (!isMetricsEnabled()) {
    return
  }

  vent.on('clients-changed', count => {
    wsClientsConnected.set(count)
  })

  vent.on('command', command => {
    wsCommandsTotal.inc({ source: command.sourceId, command: command.name })
  })
}
