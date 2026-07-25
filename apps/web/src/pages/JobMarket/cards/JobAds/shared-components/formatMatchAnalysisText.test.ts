import { describe, expect, it } from 'vitest'
import { formatMatchAnalysisScore, formatMatchAnalysisText, formatMatchAnalysisTitle } from './formatMatchAnalysisText'

const sectionLabels = {
  matchAnalysisSummarySection: 'Podsumowanie',
  matchAnalysisStrengthsSection: 'Mocne strony',
  matchAnalysisGapsSection: 'Luki',
  matchAnalysisObservationsSection: 'Obserwacje',
  matchAnalysisConclusionSection: 'Wnioski',
}

const matchAnalysis = {
  analyzedAt: '2026-01-01T00:00:00.000Z',
  score: 4,
  summary: 'Dobre dopasowanie.',
  strengths: 'React, TypeScript.',
  gaps: 'Brak doświadczenia w GraphQL.',
  observations: 'CV jest przejrzyste.',
  conclusion: 'Warto rozważyć rozmowę.',
}

describe('formatMatchAnalysisScore', () => {
  it('formats score with label template', () => {
    expect(formatMatchAnalysisScore(matchAnalysis, { matchAnalysisScore: '{score}/5' })).toBe('4/5')
  })
})

describe('formatMatchAnalysisTitle', () => {
  it('appends score to dialog title', () => {
    expect(
      formatMatchAnalysisTitle(matchAnalysis, {
        matchAnalysisTitle: 'Analiza dopasowania CV',
        matchAnalysisScore: '{score}/5',
      }),
    ).toBe('Analiza dopasowania CV — 4/5')
  })
})

describe('formatMatchAnalysisText', () => {
  it('returns all sections in order with labels', () => {
    expect(formatMatchAnalysisText(matchAnalysis, sectionLabels)).toBe(
      [
        'Podsumowanie\nDobre dopasowanie.',
        'Mocne strony\nReact, TypeScript.',
        'Luki\nBrak doświadczenia w GraphQL.',
        'Obserwacje\nCV jest przejrzyste.',
        'Wnioski\nWarto rozważyć rozmowę.',
      ].join('\n\n'),
    )
  })
})
