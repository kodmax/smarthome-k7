import { describe, expect, it } from 'vitest'
import { parseCompensation } from './compensation'

describe('parseCompensation', () => {
  it('parses USD range', () => {
    expect(parseCompensation('$150k – $200k')).toEqual({
      ok: true,
      value: { from: 150_000, to: 200_000, currency: 'USD' },
    })
  })

  it('parses single USD amount as from=to', () => {
    expect(parseCompensation('$150k • 0.1% – 0.5%')).toEqual({
      ok: true,
      value: { from: 150_000, to: 150_000, currency: 'USD' },
    })
  })

  it('parses GBP and EUR', () => {
    expect(parseCompensation('£80k – £100k')).toEqual({
      ok: true,
      value: { from: 80_000, to: 100_000, currency: 'GBP' },
    })
    expect(parseCompensation('€90k – €110k')).toEqual({
      ok: true,
      value: { from: 90_000, to: 110_000, currency: 'EUR' },
    })
  })

  it('rejects unsupported currencies and equity-only offers', () => {
    expect(parseCompensation('₹20L – ₹30L')).toEqual({ ok: false })
    expect(parseCompensation('0.1% – 0.5%')).toEqual({ ok: false })
    expect(parseCompensation('')).toEqual({ ok: false })
    expect(parseCompensation(null)).toEqual({ ok: false })
  })
})
