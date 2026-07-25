import { describe, expect, it } from 'vitest'
import { cvMatchContentToMatchAnalysis, digestCvMatchContentHash, parseCvMatchContent } from './cvMatchDocument'

describe('cvMatchDocument', () => {
  it('parses cv match content', () => {
    expect(
      parseCvMatchContent({
        analyzedAt: '2026-01-01T00:00:00.000Z',
        analysis: 'Dobre dopasowanie.',
      }),
    ).toEqual({
      analyzedAt: '2026-01-01T00:00:00.000Z',
      analysis: 'Dobre dopasowanie.',
    })
  })

  it('hashes content deterministically', () => {
    const content = {
      analyzedAt: '2026-01-01T00:00:00.000Z',
      analysis: 'Dobre dopasowanie.',
    }
    expect(digestCvMatchContentHash(content)).toBe(digestCvMatchContentHash(content))
  })

  it('maps content to feed matchAnalysis shape', () => {
    const content = {
      analyzedAt: '2026-01-01T00:00:00.000Z',
      analysis: 'Dobre dopasowanie.',
    }
    expect(cvMatchContentToMatchAnalysis(content)).toEqual({
      analyzedAt: '2026-01-01T00:00:00.000Z',
      summary: 'Dobre dopasowanie.',
    })
  })
})
