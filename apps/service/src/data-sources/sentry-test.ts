import { DataSource } from '@repo/feeds'

type SentryTestData = Record<string, never>

export class SentryTestSource extends DataSource<SentryTestData> {
  public async handleCommand(command: string): Promise<void> {
    switch (command) {
      case 'throw':
        await this.throwTestError()
        return
    }
  }

  public async throwTestError(): Promise<void> {
    throw new Error('Sentry test error (appearance settings, service)')
  }

  static getId() {
    return 'sentry-test'
  }

  static getCacheTTL() {
    return 0
  }

  protected getSourceMetricType() {
    return 'other' as const
  }

  protected isMetricsEnabled() {
    return false
  }

  protected async fetchData() {
    return {}
  }
}
