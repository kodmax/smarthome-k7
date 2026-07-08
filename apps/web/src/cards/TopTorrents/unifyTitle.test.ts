import { describe, expect, it } from 'vitest'
import { compareTitle, unifyTitle } from './unifyTitle'

describe('unifyTitle', () => {
  it('replaces dots with spaces and wraps year in parentheses', () => {
    expect(unifyTitle('The.Sheep.Detectives.2026.1080p.WEBRip')).toBe('The Sheep Detectives (2026)')
  })

  it('keeps text only up to the first year', () => {
    expect(unifyTitle('Obsession.2026.1080p.AMZN.WEB-DL')).toBe('Obsession (2026)')
    expect(unifyTitle('Pressure.2026.2026.1080p.WEBRip')).toBe('Pressure (2026)')
  })

  it('preserves letter casing', () => {
    expect(unifyTitle('Masters Of The Universe 2026 1080p')).toBe('Masters Of The Universe (2026)')
    expect(unifyTitle('Masters.Of.The.Universe.2026.1080p')).toBe('Masters Of The Universe (2026)')
  })

  it('keeps year in parentheses when already present', () => {
    expect(unifyTitle('Masters of the Universe (2026) [1080p]')).toBe('Masters of the Universe (2026)')
    expect(unifyTitle('Project Hail Mary (2026) [1080p] [WEBRip] [5.1]')).toBe('Project Hail Mary (2026)')
  })

  it('handles year without separators', () => {
    expect(unifyTitle('Ready or Not Here I Come 2(2026) [1080p]')).toBe('Ready or Not Here I Come 2 (2026)')
  })

  it('uses the full title when no year is present', () => {
    expect(unifyTitle('Amazing Films 11 - Mp4 x264 AC3 1080p')).toBe('Amazing Films 11 - Mp4 x264 AC3 1080p')
  })

  it('compares titles case-insensitively', () => {
    expect(compareTitle('Obsession (2025) [1080p]')).toBe('obsession 2025')
    expect(compareTitle('OBSESSION.2026.1080p')).toBe('obsession 2026')
    expect(compareTitle('Masters.Of.The.Universe.2026.1080p')).toBe(compareTitle('Masters of the Universe (2026)'))
  })

  it('treats different years as different titles', () => {
    expect(compareTitle('Obsession (2025) [1080p]')).not.toBe(compareTitle('Obsession.2026.1080p'))
  })

  it('normalizes titles that differ only by formatting', () => {
    const variants = [
      'The Sheep Detectives 2026 1080p WEB-DL HEVC x265 5.1 BONE',
      'The.Sheep.Detectives.2026.1080p.WEB.h264-ETHEL',
      'Three Bags Full A Sheep Detective Movie (2026) [1080p] [WEBRip] [5.1]',
    ]

    expect(compareTitle(variants[0])).toBe(compareTitle(variants[1]))
    expect(compareTitle(variants[0])).not.toBe(compareTitle(variants[2]))
  })
})
