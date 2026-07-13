import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { parseHourlyUv } from './parseHourlyHelpers'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

describe('parseHourlyUv', () => {
  it('parses numeric UV from labelled panel value', () => {
    const document = parseHTML(
      '<div class="accordion-item hour"><div class="panel"><p>Maksymalny wskaźnik UV<span class="value">0.7 (Niskie)</span></p></div></div>',
    ).window.document
    const item = document.querySelector('.accordion-item.hour')!

    expect(parseHourlyUv(item)).toBeCloseTo(0.7)
  })

  it('parses UV when the label uses an HTML entity for Polish characters', () => {
    const document = parseHTML(
      '<div class="accordion-item hour"><div class="panel"><p>Maksymalny wska&#x17A;nik UV<span class="value">1.6 (Niskie)</span></p></div></div>',
    ).window.document
    const item = document.querySelector('.accordion-item.hour')!

    expect(parseHourlyUv(item)).toBeCloseTo(1.6)
  })

  it('returns 0 when UV is missing from panel', () => {
    const document = parseHTML(
      readFileSync(path.join(fixturesDir, 'hourly.html'), 'utf8').replace(
        '<p>Maksymalny wskaźnik UV<span class="value">8 (Wysokie)</span></p>\n',
        '',
      ),
    ).window.document
    const item = document.querySelector('.accordion-item.hour')!

    expect(parseHourlyUv(item)).toBe(0)
  })
})
