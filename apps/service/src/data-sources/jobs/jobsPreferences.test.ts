import { describe, expect, it } from 'vitest'
import { parseAcceptableSalaryValue, parseSetAcceptableSalaryCommandArgs } from './jobsPreferences'

describe('parseAcceptableSalaryValue', () => {
  it('accepts positive integers', () => {
    expect(parseAcceptableSalaryValue(24_000)).toBe(24_000)
  })

  it('rejects non-numbers and non-positive values', () => {
    expect(parseAcceptableSalaryValue('24000')).toBeNull()
    expect(parseAcceptableSalaryValue(24_000.5)).toBeNull()
    expect(parseAcceptableSalaryValue(0)).toBeNull()
    expect(parseAcceptableSalaryValue(-1)).toBeNull()
  })
})

describe('parseSetAcceptableSalaryCommandArgs', () => {
  it('parses valid command args', () => {
    expect(parseSetAcceptableSalaryCommandArgs(JSON.stringify({ value: 25_000 }))).toEqual({ value: 25_000 })
  })

  it('rejects invalid command args', () => {
    expect(parseSetAcceptableSalaryCommandArgs(JSON.stringify({ value: '25000' }))).toBeNull()
    expect(parseSetAcceptableSalaryCommandArgs('not-json')).toBeNull()
  })
})
