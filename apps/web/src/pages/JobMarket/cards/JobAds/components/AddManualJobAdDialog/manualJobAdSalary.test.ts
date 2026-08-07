import { describe, expect, it } from 'vitest'
import { reverseManualJobAdSalary } from './manualJobAdSalary'

describe('reverseManualJobAdSalary', () => {
  it('round-trips b2b salary without paid vacation days', () => {
    const reversed = reverseManualJobAdSalary('b2b', { from: 22_665, to: 22_665 })

    expect(reversed.salaryFrom).toBe(30_000)
    expect(reversed.salaryTo).toBe(30_000)
  })

  it('round-trips b2b salary with paid vacation days', () => {
    const reversed = reverseManualJobAdSalary('b2b', { from: 24_714, to: 24_714 }, 20)

    expect(reversed.salaryFrom).toBe(30_000)
    expect(reversed.salaryTo).toBe(30_000)
  })
})
