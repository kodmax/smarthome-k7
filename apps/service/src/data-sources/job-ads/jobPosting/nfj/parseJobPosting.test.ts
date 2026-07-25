import { describe, expect, it } from 'vitest'
import { loadFixtureDocument, loadFixtureExpected } from '../loadFixture'
import { parseJobPosting } from './parseJobPosting'

describe('parseJobPosting (nfj)', () => {
  it('extracts title, skills and description from fixture HTML', () => {
    const document = loadFixtureDocument('nfj', 'sample.html')
    const expected = loadFixtureExpected('nfj', 'expected.json')
    expect(parseJobPosting(document)).toEqual(expected)
  })
})
