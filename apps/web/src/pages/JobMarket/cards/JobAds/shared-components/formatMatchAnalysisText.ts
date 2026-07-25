import { type JobAdMatchAnalysis } from '@repo/types'

type FormatMatchAnalysisLabels = {
  matchAnalysisTitle: string
  matchAnalysisScore: string
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
  return [
    formatSection(labels.matchAnalysisSummarySection, matchAnalysis.summary),
    formatSection(labels.matchAnalysisStrengthsSection, matchAnalysis.strengths),
    formatSection(labels.matchAnalysisGapsSection, matchAnalysis.gaps),
    formatSection(labels.matchAnalysisObservationsSection, matchAnalysis.observations),
    formatSection(labels.matchAnalysisConclusionSection, matchAnalysis.conclusion),
  ].join('\n\n')
}
