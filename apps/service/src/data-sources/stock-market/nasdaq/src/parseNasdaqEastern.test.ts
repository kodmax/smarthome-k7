import { describe, expect, it } from 'vitest'
import { parseNasdaqEasternDisplay, parseNasdaqEasternRaw, parseNasdaqTradeDate } from './parseNasdaqEastern'

const easternFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

const formatEastern = (timestamp: number): string => {
  const parts = easternFormatter.formatToParts(new Date(timestamp))
  const get = (type: Intl.DateTimeFormatPartTypes): string => parts.find(part => part.type === type)?.value ?? ''

  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`
}

describe('parseNasdaqEasternRaw', () => {
  it('parses summer schedule timestamps in EDT', () => {
    expect(parseNasdaqEasternRaw('2026-07-07T04:00:00')).toBe(1783411200000)
    expect(parseNasdaqEasternRaw('2026-07-07T09:30:00')).toBe(1783431000000)
    expect(parseNasdaqEasternRaw('2026-07-07T16:00:00')).toBe(1783454400000)
    expect(parseNasdaqEasternRaw('2026-07-07T20:00:00')).toBe(1783468800000)
  })

  it('parses winter timestamps in EST', () => {
    const timestamp = parseNasdaqEasternRaw('2026-01-15T10:00:00')

    expect(formatEastern(timestamp)).toBe('2026-01-15 10:00:00')
  })
})

describe('parseNasdaqEasternDisplay', () => {
  it('parses Nasdaq ET display datetimes', () => {
    expect(parseNasdaqEasternDisplay('Jul 7, 2026 04:00 AM ET')).toBe(parseNasdaqEasternRaw('2026-07-07T04:00:00'))
    expect(parseNasdaqEasternDisplay('Jul 7, 2026 09:30 AM ET')).toBe(parseNasdaqEasternRaw('2026-07-07T09:30:00'))
    expect(parseNasdaqEasternDisplay('Jul 7, 2026 04:00 PM ET')).toBe(parseNasdaqEasternRaw('2026-07-07T16:00:00'))
    expect(parseNasdaqEasternDisplay('Jul 7, 2026 08:00 PM ET')).toBe(parseNasdaqEasternRaw('2026-07-07T20:00:00'))
  })
})

describe('parseNasdaqTradeDate', () => {
  it('parses trade dates as midnight Eastern time', () => {
    expect(parseNasdaqTradeDate('Jul 6, 2026')).toBe(parseNasdaqEasternRaw('2026-07-06T00:00:00'))
    expect(parseNasdaqTradeDate('Jul 8, 2026')).toBe(parseNasdaqEasternRaw('2026-07-08T00:00:00'))
  })
})
