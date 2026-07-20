import { describe, expect, it } from 'vitest'
import { toIsoDate } from './toIsoDate'

describe('toIsoDate', () => {
  it('normalizes UTC timestamps without Z suffix', () => {
    expect(toIsoDate('2026-06-11T07:03:43.823')).toBe('2026-06-11T07:03:43.823Z')
  })

  it('keeps already normalized UTC timestamps', () => {
    expect(toIsoDate('2026-06-11T07:03:43.823Z')).toBe('2026-06-11T07:03:43.823Z')
  })
})
