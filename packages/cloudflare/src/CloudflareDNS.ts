import { APIResponse, ClientConfig, DNSRecord, DNSRecordValues, Zone } from './types'

export class CloudflareDNS {
  private readonly token: string

  private async request<T>(method: string, path: string, payload?: unknown): Promise<APIResponse<T>> {
    const resp = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      method,
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    })

    if (!resp.ok) {
      throw new Error(`Request to ${path} failed: ${resp.status}`)
    }

    return resp.json()
  }

  constructor(config: ClientConfig) {
    this.token = config.token
  }

  getPublicIp(): Promise<string> {
    return fetch('https://api.ipify.org').then(r => r.text())
  }

  async getZone(zoneName: string): Promise<Zone> {
    const resp = await this.request<Zone[]>('get', `/zones?name=${encodeURIComponent(zoneName)}`)
    if (resp.result.length !== 1) {
      throw new Error('Zone not found')
    }

    return resp.result[0]
  }

  async getRecord(zoneId: string, recordName: string, recordType: string): Promise<DNSRecord> {
    const resp = await this.request<DNSRecord[]>(
      'get',
      `/zones/${zoneId}/dns_records?type=${recordType}&name=${encodeURIComponent(recordName)}`,
    )
    if (resp.result.length !== 1) {
      throw new Error('Record not found')
    }

    return resp.result[0]
  }

  async updateRecord(zoneId: string, recordId: string, values: DNSRecordValues): Promise<void> {
    await this.request<DNSRecord>('put', `/zones/${zoneId}/dns_records/${recordId}`, values)
  }
}
