import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { parseHourlyWind } from './parseHourlyHelpers'

describe('parseHourlyWind', () => {
  it('parses direction and speed from panel value', () => {
    const document = parseHTML(
      '<div class="accordion-item hour"><div class="panel"><p>Wiatr<span class="value">NE 12 km/h</span></p></div></div>',
    ).window.document
    const item = document.querySelector('.accordion-item.hour')!

    expect(parseHourlyWind(item)).toEqual({
      direction: 'NE',
      speed: Math.round(12 / 3.6),
    })
  })

  it('returns null direction for calm wind', () => {
    const document = parseHTML(
      '<div class="accordion-item hour"><div class="panel"><p>Wiatr<span class="value">0 km/h</span></p></div></div>',
    ).window.document
    const item = document.querySelector('.accordion-item.hour')!

    expect(parseHourlyWind(item)).toEqual({
      direction: null,
      speed: 0,
    })
  })

  it('rounds wind speed to whole m/s', () => {
    const document = parseHTML(
      '<div class="accordion-item hour"><div class="panel"><p>Wiatr<span class="value">NE 13 km/h</span></p></div></div>',
    ).window.document
    const item = document.querySelector('.accordion-item.hour')!

    expect(parseHourlyWind(item).speed).toBe(Math.round(13 / 3.6))
  })
})
