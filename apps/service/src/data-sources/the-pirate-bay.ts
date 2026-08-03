import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { Torrent } from '@repo/types'
import { fetchJSON } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'

export class TorrentSource extends DataSource<Torrent[]> {
  private query = ''

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'search':
        this.query = args
        void this.push(await this.fetchData())
        return
    }
  }

  static getId(): string {
    return 'torrents'
  }

  static getCron(): string {
    return '0 3 * * *'
  }

  static getCacheTTL(): number {
    return CacheAgeUnit.HOUR * 12
  }

  protected getSourceMetricType() {
    return 'api' as const
  }

  protected async fetchData(): Promise<Torrent[]> {
    const url =
      this.query !== ''
        ? `https://apibay.org/q.php?q=${encodeURIComponent(this.query)}&cat=207`
        : 'https://apibay.org/precompiled/data_top100_207.json'

    return observeHttpFetch(url, 'json', () => fetchJSON<Torrent[]>(url))
  }
}
