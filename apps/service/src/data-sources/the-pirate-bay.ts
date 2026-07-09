import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { Torrent } from '@repo/types'
import { Transmission3 } from '@repo/transmission'
import { config } from '@/config'
import { fetchJSON } from '@/fetch'

export class TorrentSource extends DataSourceDefinition<Torrent[]> {
  private transmission: Transmission3
  private query = ''

  constructor(push: (content: Torrent[]) => void, reportError: (e: Error) => void) {
    super(push, reportError)

    this.transmission = new Transmission3(config.transmission)
  }

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'search':
        this.query = args
        this.push(await this.getData())
        return
      
      case 'download':
        await this.transmission.addTorrent(args)
        return
    }
  }

  public getId(): string {
    return 'torrents'
  }

  public getCron(): string {
    return '0 3 * * *'
  }

  public isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }): boolean {
    return snapshot.age(CacheAgeUnit.HOURS) > 12
  }

  public async getData(): Promise<Torrent[]> {
    return await fetchJSON<Torrent[]>(
      this.query !== ''
        ? `https://apibay.org/q.php?q=${encodeURIComponent(this.query)}&cat=207`
        : 'https://apibay.org/precompiled/data_top100_207.json',
    )
  }
}
