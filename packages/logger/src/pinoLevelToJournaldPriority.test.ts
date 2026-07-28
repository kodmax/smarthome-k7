import { describe, expect, it } from 'vitest'
import { pinoLevelToJournaldPriority } from './pinoLevelToJournaldPriority'

describe('pinoLevelToJournaldPriority', () => {
  it('maps known pino levels to journald priorities', () => {
    expect(pinoLevelToJournaldPriority(10)).toBe(7)
    expect(pinoLevelToJournaldPriority(20)).toBe(7)
    expect(pinoLevelToJournaldPriority(30)).toBe(6)
    expect(pinoLevelToJournaldPriority(40)).toBe(4)
    expect(pinoLevelToJournaldPriority(50)).toBe(3)
    expect(pinoLevelToJournaldPriority(60)).toBe(2)
  })

  it('defaults unknown levels to info (6)', () => {
    expect(pinoLevelToJournaldPriority(99)).toBe(6)
  })
})
