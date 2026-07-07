import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { fetchJSON } from '@/fetch'
import { Torrent } from '@repo/types'

export class TorrentSource extends DataSourceDefinition<Torrent[]> {
  private query = ''

  public async handleCommand(command: string, args: string): Promise<void> {
    if (command !== 'search') {
      return
    }

    this.query = args
    this.push(await this.getData())
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
