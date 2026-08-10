import { describe, expect, it } from 'vitest'
import { buildCommandRequest } from './buildCommandRequest'

const apiBaseUrl = 'http://localhost/api'

describe('buildCommandRequest', () => {
  it('builds void command without body', () => {
    expect(buildCommandRequest(apiBaseUrl, 'energy.meter', 'reset', undefined)).toEqual({
      url: 'http://localhost/api/data-sources/energy.meter/command/reset',
    })
  })

  it('wraps string fav into itemId body', () => {
    expect(buildCommandRequest(apiBaseUrl, 'job-ads', 'fav', 'jj-1')).toEqual({
      url: 'http://localhost/api/data-sources/job-ads/command/fav',
      body: { itemId: 'jj-1' },
    })
  })

  it('wraps string news read into itemUid body', () => {
    expect(buildCommandRequest(apiBaseUrl, 'news', 'read', 'uid-1')).toEqual({
      url: 'http://localhost/api/data-sources/news/command/read',
      body: { itemUid: 'uid-1' },
    })
  })

  it('passes object payload as body', () => {
    expect(buildCommandRequest(apiBaseUrl, 'job-ads', 'set-acceptable-salary', { value: 12000 })).toEqual({
      url: 'http://localhost/api/data-sources/job-ads/command/set-acceptable-salary',
      body: { value: 12000 },
    })
  })

  it('throws for unknown string command mapping', () => {
    expect(() => buildCommandRequest(apiBaseUrl, 'job-ads', 'change-state', 'jj-1' as never)).toThrow(
      'Unknown string command payload mapping: job-ads.change-state',
    )
  })
})
