import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { JobPostingDetails } from './types'
import { parseHtmlDocument } from '@/fetch/parseHtmlDocument'

type PortalFixtureDir = 'jjit' | 'nfj'

const jobPostingRoot = __dirname

export async function loadFixtureDocument(portal: PortalFixtureDir, filename: string): Promise<Document> {
  const html = readFileSync(path.join(jobPostingRoot, portal, 'fixtures', filename), 'utf8')
  return parseHtmlDocument(html)
}

export function loadFixtureExpected(portal: PortalFixtureDir, filename: string): JobPostingDetails {
  const raw = readFileSync(path.join(jobPostingRoot, portal, 'fixtures', filename), 'utf8')
  return JSON.parse(raw) as JobPostingDetails
}
