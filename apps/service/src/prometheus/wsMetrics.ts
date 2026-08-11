import type { FeedEvents } from '@repo/feeds'
import { Counter, Gauge, register } from 'prom-client'
import { isMetricsEnabled } from './metricsEnabled'

const wsClientsConnected = new Gauge({
  name: 'apollo_daemon_ws_clients_connected',
  help: 'Number of connected WebSocket clients',
  registers: [register],
})

const wsFeedUpdatesSentTotal = new Counter({
  name: 'apollo_daemon_ws_feed_updates_sent_total',
  help: 'Feed update messages sent to WebSocket clients, grouped by device UUID',
  labelNames: ['device_id', 'feed_id'],
  registers: [register],
})

export const registerWsMetrics = (vent: FeedEvents): void => {
  if (!isMetricsEnabled()) {
    return
  }

  vent.on('clients-changed', count => {
    wsClientsConnected.set(count)
  })

  vent.on('feed-update-sent', (deviceId, feedId) => {
    wsFeedUpdatesSentTotal.inc({ device_id: deviceId, feed_id: feedId })
  })
}
