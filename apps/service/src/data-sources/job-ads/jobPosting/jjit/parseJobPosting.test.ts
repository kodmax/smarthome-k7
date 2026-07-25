import { describe, expect, it } from 'vitest'
import { loadFixtureDocument, loadFixtureExpected } from '../loadFixture'
import { parseJobPosting } from './parseJobPosting'

describe('parseJobPosting (jjit)', () => {
  it('extracts title, skills and description from fixture HTML', () => {
    const document = loadFixtureDocument('jjit', 'sample.html')
    const expected = loadFixtureExpected('jjit', 'expected.json')
    expect(parseJobPosting(document)).toEqual(expected)
  })
})
