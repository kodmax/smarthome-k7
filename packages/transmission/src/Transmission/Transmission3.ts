import { type TransmissionClientConfig } from './types'
import { TransmissionClient } from './TransmissionClient'
import { SessionStats, TorrentAdded } from './api-types'

export class Transmission3 {
  private readonly client: TransmissionClient

  constructor(config: TransmissionClientConfig) {
    this.client = new TransmissionClient(config)
  }

  async getSessionStats(): Promise<SessionStats> {
    return this.client.call('session-stats') as Promise<SessionStats>
  }

  async addTorrent(url: string): Promise<TorrentAdded> {
    return this.client.call('torrent-add', { filename: url })
  }
}
