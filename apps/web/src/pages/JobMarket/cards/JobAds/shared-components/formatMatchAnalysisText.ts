import { type JobAdMatchAnalysis } from '@repo/types'

type FormatMatchAnalysisLabels = {
  matchAnalysisTitle: string
  matchAnalysisScore: string
  matchAnalysisStaleNotice: string
  matchAnalysisSummarySection: string
  matchAnalysisStrengthsSection: string
  matchAnalysisGapsSection: string
  matchAnalysisObservationsSection: string
  matchAnalysisConclusionSection: string
}

function formatSection(label: string, text: string): string {
  return `${label}\n${text}`
}

export function formatMatchAnalysisScore(
  matchAnalysis: JobAdMatchAnalysis,
  labels: Pick<FormatMatchAnalysisLabels, 'matchAnalysisScore'>,
): string {
  return labels.matchAnalysisScore.replace('{score}', String(matchAnalysis.score))
}

export function formatMatchAnalysisTitle(
  matchAnalysis: JobAdMatchAnalysis,
  labels: Pick<FormatMatchAnalysisLabels, 'matchAnalysisTitle' | 'matchAnalysisScore'>,
): string {
  return `${labels.matchAnalysisTitle} — ${formatMatchAnalysisScore(matchAnalysis, labels)}`
}

export function formatMatchAnalysisStaleNotice(
  isCurrentCVUsed: boolean,
  labels: Pick<FormatMatchAnalysisLabels, 'matchAnalysisStaleNotice'>,
): string | null {
  return isCurrentCVUsed ? null : labels.matchAnalysisStaleNotice
}

export function formatMatchAnalysisText(
  matchAnalysis: JobAdMatchAnalysis,
  labels: Pick<
    FormatMatchAnalysisLabels,
    | 'matchAnalysisSummarySection'
    | 'matchAnalysisStrengthsSection'
    | 'matchAnalysisGapsSection'
    | 'matchAnalysisObservationsSection'
    | 'matchAnalysisConclusionSection'
  >,
): string {
  const sections = [
    formatSection(labels.matchAnalysisSummarySection, matchAnalysis.summary),
    formatSection(labels.matchAnalysisStrengthsSection, matchAnalysis.strengths),
    formatSection(labels.matchAnalysisGapsSection, matchAnalysis.gaps),
    formatSection(labels.matchAnalysisObservationsSection, matchAnalysis.observations),
    formatSection(labels.matchAnalysisConclusionSection, matchAnalysis.conclusion),
  ]

  return sections.join('\n\n')
}
