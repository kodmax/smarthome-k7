import { createHash } from 'node:crypto'

export function normalizeManualAdvertUrl(advertUrl: string): string {
  const trimmed = advertUrl.trim()
  const parsed = new URL(trimmed)
  const host = parsed.hostname.replace(/^www\./i, '').toLowerCase()
  const pathname = parsed.pathname.replace(/\/+$/, '')
  const search = parsed.search

  return `${parsed.protocol}//${host}${pathname}${search}`
}

export const digestManualId = (advertUrl: string): string =>
  createHash('sha256')
    .update(`manual:${normalizeManualAdvertUrl(advertUrl)}`)
    .digest('hex')
