import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parseHTML } from 'linkedom'
import type { JobPostingDetails } from './types'

type PortalFixtureDir = 'jjit' | 'nfj'

const jobPostingRoot = __dirname

export function loadFixtureDocument(portal: PortalFixtureDir, filename: string): Document {
  const html = readFileSync(path.join(jobPostingRoot, portal, 'fixtures', filename), 'utf8')
  return parseHTML(html).window.document
}

export function loadFixtureExpected(portal: PortalFixtureDir, filename: string): JobPostingDetails {
  const raw = readFileSync(path.join(jobPostingRoot, portal, 'fixtures', filename), 'utf8')
  return JSON.parse(raw) as JobPostingDetails
}
