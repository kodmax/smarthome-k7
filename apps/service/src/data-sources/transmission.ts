import { CacheAgeUnit, DataSource, type DataSourceParams } from '@repo/feeds'
import { TransmissionFeed } from '@repo/types'
import { Transmission3 } from '@repo/transmission'
import { Inject } from '@/di'
import type { config as AppConfig } from '@/config'

export class TransmissionSource extends DataSource<TransmissionFeed> {
  @Inject('config')
  declare private config: typeof AppConfig

  private transmission: Transmission3
  private pollTimer: ReturnType<typeof setTimeout> | undefined

  public constructor(params: DataSourceParams<TransmissionFeed>) {
    super(params)

    this.transmission = new Transmission3(this.config.transmission)
  }

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'download':
        await this.download(args)
        return
    }
  }

  public async download(torrent: string): Promise<void> {
    await this.transmission.addTorrent(torrent)
    this.startPolling()
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) {
      clearTimeout(this.pollTimer)
      this.pollTimer = undefined
    }
  }

  private startPolling(): void {
    this.stopPolling()
    void this.pollOnce()
  }

  private async pollOnce(): Promise<void> {
    try {
      const data = await this.fetchData()
      void this.push(data)

      if (data.sessionStats.torrentCount > 0) {
        this.pollTimer = setTimeout(() => {
          this.pollTimer = undefined
          void this.pollOnce()
        }, 5000)
      }
    } catch (e) {
      this.reportError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  static getId(): string {
    return 'transmission'
  }

  static getCron(): string {
    return '* * * * *'
  }

  static getCacheTTL(): number {
    return CacheAgeUnit.MINUTE
  }

  protected getSourceMetricType() {
    return 'other' as const
  }

  protected isMetricsEnabled(): boolean {
    return false
  }

  protected async fetchData(): Promise<TransmissionFeed> {
    const stats = await this.transmission.getSessionStats()

    return {
      sessionStats: {
        downloadSpeed: stats.downloadSpeed,
        torrentCount: stats.torrentCount,
        uploadSpeed: stats.uploadSpeed,
      },
    }
  }
}
