import { describe, expect, it } from 'vitest'
import { convertEasterTime } from './convertEasterTime'

describe('convertEasterTime', () => {
  describe('PM', () => {
    it('should convert EDT to CEST', () => {
      // 6h
      expect(convertEasterTime('5:30:46 PM EDT', 2)).toBe('23:30:46')
    })

    it('should convert EDT to CET', () => {
      // 5h
      expect(convertEasterTime('5:30:46 PM EDT', 1)).toBe('22:30:46')
    })

    it('should convert EST to CEST', () => {
      // 7h
      expect(convertEasterTime('5:30:46 PM EST', 2)).toBe('00:30:46')
    })

    it('should convert EST to CET', () => {
      // 6h
      expect(convertEasterTime('5:30:46 PM EST', 1)).toBe('23:30:46')
    })
  })

  describe('AM', () => {
    it('should convert EDT to CEST', () => {
      expect(convertEasterTime('2:43:41 AM EDT', 2)).toBe('08:43:41')
    })

    it('should convert EDT to CET', () => {
      expect(convertEasterTime('2:43:41 AM EDT', 1)).toBe('07:43:41')
    })

    it('should convert EST to CEST', () => {
      expect(convertEasterTime('2:43:41 AM EST', 2)).toBe('09:43:41')
    })

    it('should convert EST to CET', () => {
      expect(convertEasterTime('2:43:41 AM EST', 1)).toBe('08:43:41')
    })
  })
})
