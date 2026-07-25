import { describe, expect, it } from 'vitest'
import { cvMatchContentToMatchAnalysis, digestCvMatchContentHash, parseCvMatchContent } from './cvMatchDocument'

const content = {
  analyzedAt: '2026-01-01T00:00:00.000Z',
  score: 4,
  summary: 'Dobre dopasowanie.',
  strengths: 'React, TypeScript.',
  gaps: 'Brak doświadczenia w GraphQL.',
  observations: 'CV jest przejrzyste.',
  conclusion: 'Warto rozważyć rozmowę.',
}

describe('cvMatchDocument', () => {
  it('parses cv match content', () => {
    expect(parseCvMatchContent(content)).toEqual(content)
  })

  it('returns null for legacy content', () => {
    expect(
      parseCvMatchContent({
        analyzedAt: '2026-01-01T00:00:00.000Z',
        analysis: 'Ocena dopasowania: dobre, około 75%\n\nSzczegóły.',
      }),
    ).toBeNull()

    expect(
      parseCvMatchContent({
        analyzedAt: '2026-01-01T00:00:00.000Z',
        score: 4,
        summary: 'Dobre dopasowanie.',
        analysis: 'Szczegółowa analiza.',
      }),
    ).toBeNull()
  })

  it('hashes content deterministically', () => {
    expect(digestCvMatchContentHash(content)).toBe(digestCvMatchContentHash(content))
  })

  it('maps content to feed matchAnalysis shape', () => {
    expect(cvMatchContentToMatchAnalysis(content)).toEqual(content)
  })
})
