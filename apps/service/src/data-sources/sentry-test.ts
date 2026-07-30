import { DataSourceDefinition } from '@repo/apollo-ws'

type SentryTestData = Record<string, never>

export class SentryTestSource extends DataSourceDefinition<SentryTestData> {
  public async handleCommand(command: string): Promise<void> {
    if (command === 'throw') {
      throw new Error('Sentry test error (appearance settings, service)')
    }
  }

  getId() {
    return 'sentry-test'
  }

  getCacheTTL() {
    return 0
  }

  getSourceMetricType() {
    return 'other' as const
  }

  isMetricsEnabled() {
    return false
  }

  async getData() {
    return {}
  }
}
