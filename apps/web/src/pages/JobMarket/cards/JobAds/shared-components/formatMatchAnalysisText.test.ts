import { describe, expect, it } from 'vitest'
import {
  formatMatchAnalysisScore,
  formatMatchAnalysisStaleNotice,
  formatMatchAnalysisText,
  formatMatchAnalysisTitle,
} from './formatMatchAnalysisText'

const sectionLabels = {
  matchAnalysisStaleNotice: 'Analiza dotyczy wcześniejszej wersji CV — przeanalizuj ponownie.',
  matchAnalysisSummarySection: 'Podsumowanie',
  matchAnalysisStrengthsSection: 'Mocne strony',
  matchAnalysisGapsSection: 'Luki',
  matchAnalysisMustHaveGapsSection: 'Brakujące wymagania must-have',
  matchAnalysisMustHaveGapsEmpty: 'brak',
  matchAnalysisObservationsSection: 'Obserwacje',
  matchAnalysisConclusionSection: 'Wnioski',
}

const matchAnalysisBody = [
  'Podsumowanie\nDobre dopasowanie.',
  'Mocne strony\nReact, TypeScript.',
  'Luki\nBrak doświadczenia w GraphQL.',
  'Obserwacje\nCV jest przejrzyste.',
  'Wnioski\nWarto rozważyć rozmowę.',
].join('\n\n')

const matchAnalysis = {
  analyzedAt: '2026-01-01T00:00:00.000Z',
  score: 80,
  summary: 'Dobre dopasowanie.',
  strengths: 'React, TypeScript.',
  gaps: 'Brak doświadczenia w GraphQL.',
  observations: 'CV jest przejrzyste.',
  conclusion: 'Warto rozważyć rozmowę.',
}

describe('formatMatchAnalysisScore', () => {
  it('formats score with label template', () => {
    expect(formatMatchAnalysisScore(matchAnalysis, { matchAnalysisScore: '{score}%' })).toBe('80%')
  })
})

describe('formatMatchAnalysisTitle', () => {
  it('appends score to dialog title', () => {
    expect(
      formatMatchAnalysisTitle(matchAnalysis, {
        matchAnalysisTitle: 'Analiza dopasowania CV',
        matchAnalysisScore: '{score}%',
      }),
    ).toBe('Analiza dopasowania CV — 80%')
  })
})

describe('formatMatchAnalysisStaleNotice', () => {
  it('returns null when analysis uses current CV', () => {
    expect(formatMatchAnalysisStaleNotice(true, sectionLabels)).toBeNull()
  })

  it('returns stale notice when analysis is outdated', () => {
    expect(formatMatchAnalysisStaleNotice(false, sectionLabels)).toBe(sectionLabels.matchAnalysisStaleNotice)
  })
})

describe('formatMatchAnalysisText', () => {
  it('returns all sections in order with labels', () => {
    expect(formatMatchAnalysisText(matchAnalysis, sectionLabels)).toBe(matchAnalysisBody)
  })

  it('omits mustHaveGaps section when undefined', () => {
    expect(formatMatchAnalysisText(matchAnalysis, sectionLabels)).not.toContain('Brakujące wymagania must-have')
  })

  it('renders mustHaveGaps as a list below gaps', () => {
    const text = formatMatchAnalysisText(
      {
        ...matchAnalysis,
        mustHaveGaps: ['Minimum 5 lat doświadczenia komercyjnego w React', 'Znajomość Kubernetes'],
      },
      sectionLabels,
    )

    expect(text).toContain('Luki\nBrak doświadczenia w GraphQL.')
    expect(text).toContain(
      'Brakujące wymagania must-have\n- Minimum 5 lat doświadczenia komercyjnego w React\n- Znajomość Kubernetes',
    )
    expect(text.indexOf('Luki')).toBeLessThan(text.indexOf('Brakujące wymagania must-have'))
    expect(text.indexOf('Brakujące wymagania must-have')).toBeLessThan(text.indexOf('Obserwacje'))
  })

  it('renders "brak" when mustHaveGaps is empty', () => {
    const text = formatMatchAnalysisText(
      {
        ...matchAnalysis,
        mustHaveGaps: [],
      },
      sectionLabels,
    )

    expect(text).toContain('Brakujące wymagania must-have\nbrak')
  })
})
