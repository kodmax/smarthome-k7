import type OpenAI from 'openai'
import type { Sql } from '@repo/db'
import { analyzeCvMatch } from './analyzeCvMatch'
import { type CvMatchContent, loadCV, saveCvMatch } from './cvMatchDocument'
import { detectOrigin } from './jobPosting/detectOrigin'
import { fetchJobPostingDetails } from './jobPosting/fetchJobPostingDetails'

type AnalyzeCvMatchInput = {
  db: Sql
  openai: OpenAI
  adId: string
  loadAdUrl: (itemId: string) => Promise<string | null>
}

export async function runAnalyzeCvMatchCommand(input: AnalyzeCvMatchInput): Promise<CvMatchContent> {
  const adId = input.adId.trim()
  if (adId.length === 0) {
    throw new Error('analyze-cv-match: missing ad id')
  }

  const cv = await loadCV(input.db)
  if (cv === null || cv.text === null || cv.text.length === 0 || cv.hash === null) {
    throw new Error('analyze-cv-match: CV not found')
  }

  const adUrl = await input.loadAdUrl(adId)
  if (adUrl === null) {
    throw new Error(`analyze-cv-match: ad-url not found for ad ${adId}`)
  }

  if (detectOrigin(adUrl) === 'theprotocol') {
    throw new Error('analyze-cv-match: analyze not implemented for theprotocol')
  }

  const posting = await fetchJobPostingDetails(adUrl)
  if (posting === null) {
    throw new Error(`analyze-cv-match: failed to parse job posting from ${adUrl}`)
  }

  const result = await analyzeCvMatch(input.openai, cv.text, posting)
  const content: CvMatchContent = {
    analyzedAt: new Date().toISOString(),
    ...result,
  }

  await saveCvMatch(input.db, adId, content, cv.hash)
  return content
}
