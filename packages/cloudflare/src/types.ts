export type ClientConfig = {
  token: string
}

export interface APIResponse<T> {
  result: T
  result_info: { page: number; per_page: number; total_pages: number; count: number; total_count: number }
  success: boolean
  errors: unknown[]
  messages: unknown[]
}

export interface Zone {
  id: string
  name: string
  status: 'active'
  paused: boolean
  type: 'full'
  development_mode: 0
  name_servers: unknown[]
  original_name_servers: unknown[]
  original_registrar: 'home.pl sp. z o.o. (id: )'
  original_dnshost: null
  modified_on: string
  created_on: string
  activated_on: string
  vanity_name_servers: []
  vanity_name_servers_ips: null
  meta: unknown[]
  owner: unknown[]
  account: unknown[]
  tenant: unknown[]
  tenant_unit: unknown[]
  permissions: unknown[]
  plan: unknown[]
}

export type DNSRecordValues = {
  name: string
  type: string
  content: string
  ttl: number
  proxied: boolean
}

export type DNSRecordMeta = {
  id: string
  proxiable: boolean
  settings: unknown
  meta: unknown
  comment: null
  tags: unknown[]
  created_on: string
  modified_on: string
}

export type DNSRecord = DNSRecordValues & DNSRecordMeta
