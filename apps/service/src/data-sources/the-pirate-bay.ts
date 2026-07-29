import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { Torrent } from '@repo/types'
import { fetchJSON } from '@/fetch'
import { observeHttpFetch, observeScraperRefresh } from '@/prometheus/scraperMetrics'

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

  public getCacheTTL(): number {
    return CacheAgeUnit.HOUR * 12
  }

  public async getData(): Promise<Torrent[]> {
    return observeScraperRefresh(this.getId(), () => {
      const url =
        this.query !== ''
          ? `https://apibay.org/q.php?q=${encodeURIComponent(this.query)}&cat=207`
          : 'https://apibay.org/precompiled/data_top100_207.json'

      return observeHttpFetch(url, 'json', () => fetchJSON<Torrent[]>(url))
    })
  }
}
