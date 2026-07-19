import { parseWindValue } from './parseWindValue'
import { toMetersPerSecond } from './toMetersPerSecond'

export const HOURLY_UV_LABEL = 'Maksymalny wskaźnik UV'

export const hourlyHourSelector = '.accordion-item.hour, .hourly-wrapper .hour'

const parseHourlyPanelLabel = (paragraph: Element): string | undefined => {
  const valueEl = paragraph.querySelector('.value')
  if (valueEl === null) {
    return paragraph.textContent?.trim()
  }

  const clone = paragraph.cloneNode(true) as Element
  clone.querySelector('.value')?.remove()

  return clone.textContent?.trim()
}

export const parseHourlyPanel = (item: Element): Record<string, string> => {
  const panel: Record<string, string> = {}

  for (const paragraph of item.querySelectorAll('.panel p')) {
    const label = parseHourlyPanelLabel(paragraph)
    const value = paragraph.querySelector('.value')?.textContent?.trim()
    if (label !== undefined && label !== '' && value !== undefined && value !== '') {
      panel[label] = value
    }
  }

  return panel
}

export const parseHourlyWind = (item: Element) => {
  const wind = parseHourlyPanel(item).Wiatr
  if (wind === undefined) {
    throw new Error('missing "Wiatr" in hourly forecast panel')
  }

  const { direction, speed, speedUnit } = parseWindValue(wind)
  const speedMs = toMetersPerSecond(speed, speedUnit)

  return {
    direction: direction === '' || speed === 0 ? null : direction,
    speed: speedMs,
  }
}

export const parseHourlyUv = (item: Element): number => {
  const uvRaw = parseHourlyPanel(item)[HOURLY_UV_LABEL]
  if (uvRaw === undefined) {
    return 0
  }

  return Number(uvRaw.replace(/[^\d.]/g, ''))
}
