import { describe, expect, it } from 'vitest'
import { detectOrigin } from './detectOrigin'

describe('detectOrigin', () => {
  it('detects JustJoin URLs', () => {
    expect(detectOrigin('https://justjoin.it/job-offer/acme-senior-react-warszawa-javascript')).toBe('jj')
  })

  it('detects NoFluffJobs URLs', () => {
    expect(detectOrigin('https://nofluffjobs.com/pl/job/senior-react-developer-acme')).toBe('nfj')
  })

  it('detects TheProtocol URLs', () => {
    expect(
      detectOrigin(
        'https://theprotocol.it/szczegoly/praca/web-engineer-warszawa,oferta,47a40000-59d6-3231-434e-08dec78793b9',
      ),
    ).toBe('theprotocol')
  })

  it('returns null for unknown URLs', () => {
    expect(detectOrigin('https://example.com/jobs/1')).toBeNull()
  })
})
