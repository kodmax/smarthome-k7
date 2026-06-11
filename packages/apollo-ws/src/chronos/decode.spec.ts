import { CronDayOfWeek, CronMonth, decode } from './decode'
import { describe, it, expect } from 'vitest'

describe('Chronos decode', () => {
  it('numeric element', () => {
    expect(decode(`4`, 0, 6)).toStrictEqual([4])
  })

  it('multiple numeric elements', () => {
    expect(decode(`1,0,3`, 0, 6)).toStrictEqual([1, 0, 3])
  })

  it('named element', () => {
    expect(decode(`Sun`, 0, 6, CronDayOfWeek)).toStrictEqual([0])
  })

  it('multiple named elements', () => {
    expect(decode(`Fri,Mon,Sun`, 0, 6, CronDayOfWeek)).toStrictEqual([5, 1, 0])
  })

  it('numeric range', () => {
    expect(decode(`4-6`, 1, 6)).toStrictEqual([4, 5, 6])
  })

  it('numeric range with overflow', () => {
    expect(decode(`10-2`, 0, 23)).toStrictEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2])
  })

  it('numeric range with overflow and step', () => {
    expect(decode(`10-2/5`, 0, 23)).toStrictEqual([10, 15, 20, 1])
  })

  it('named range', () => {
    expect(decode(`Jan-May`, 0, 6, CronMonth)).toStrictEqual([1, 2, 3, 4, 5])
  })

  it('range with step', () => {
    expect(decode(`1-5/2`, 0, 6)).toStrictEqual([1, 3, 5])
  })

  it('number with step', () => {
    expect(decode(`Wed/3`, 0, 6, CronDayOfWeek)).toStrictEqual([3, 6])
  })
})
