import type { FeedEvents } from '@repo/feeds'
import { Gauge, register } from 'prom-client'
import { isMetricsEnabled } from './metricsEnabled'

const wsClientsConnected = new Gauge({
  name: 'apollo_daemon_ws_clients_connected',
  help: 'Number of connected WebSocket clients',
  registers: [register],
})

export const registerWsMetrics = (vent: FeedEvents): void => {
  if (!isMetricsEnabled()) {
    return
  }

  vent.on('clients-changed', count => {
    wsClientsConnected.set(count)
  })
}
