import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { Torrent } from '@repo/types'
import { fetchJSON } from '@/fetch'

export class TorrentSource extends DataSourceDefinition<Torrent[]> {
  private query = ''

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'search':
        this.query = args
        this.push(await this.getData())
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
