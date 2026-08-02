import { CacheAgeUnit, DataSourceDefinition } from '@repo/feeds'
import { Torrent } from '@repo/types'
import { fetchJSON } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'

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

  public getSourceMetricType() {
    return 'api' as const
  }

  public async getData(): Promise<Torrent[]> {
    const url =
      this.query !== ''
        ? `https://apibay.org/q.php?q=${encodeURIComponent(this.query)}&cat=207`
        : 'https://apibay.org/precompiled/data_top100_207.json'

    return observeHttpFetch(url, 'json', () => fetchJSON<Torrent[]>(url))
  }
}
