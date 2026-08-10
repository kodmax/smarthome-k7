import { Counter, register } from 'prom-client'
import { isMetricsEnabled } from './metricsEnabled'

export type ApiCommandOutcome = 'success' | 'error'

const COMMAND_PATH = /^\/data-sources\/([^/]+)\/command\/([^/]+)\/?$/

export const parseCommandRequestPath = (path: string): { source: string; command: string } | undefined => {
  const match = COMMAND_PATH.exec(path)
  if (!match) {
    return undefined
  }

  return { source: match[1], command: match[2] }
}

const apiCommandsTotal = new Counter({
  name: 'apollo_daemon_api_commands_total',
  help: 'Total data-source commands received via HTTP API',
  labelNames: ['source', 'command', 'outcome'],
  registers: [register],
})

export const incApiCommand = (source: string, command: string, outcome: ApiCommandOutcome): void => {
  if (!isMetricsEnabled()) {
    return
  }

  apiCommandsTotal.inc({ source, command, outcome })
}
