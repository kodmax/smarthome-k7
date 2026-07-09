import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { TransmissionFeed } from '@repo/types'
import { Transmission3 } from '@repo/transmission'
import { config } from '@/config'

export class TransmissionSource extends DataSourceDefinition<TransmissionFeed> {
  private transmission: Transmission3

  constructor(push: (content: TransmissionFeed) => void, reportError: (e: Error) => void) {
    super(push, reportError)

    this.transmission = new Transmission3(config.transmission)
  }

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'download':
        await this.transmission.addTorrent(args)
        this.push(await this.getData())
        return
    }
  }

  public getId(): string {
    return 'transmission'
  }

  public getCron(): string {
    return '* * * * *'
  }

  public isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }): boolean {
    return snapshot.age(CacheAgeUnit.MINUTES) > 1
  }

  public async getData(): Promise<TransmissionFeed> {
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
