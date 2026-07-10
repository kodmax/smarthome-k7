export const DEFAULT_NUMBER_LOCALE = 'pl-PL'

export type FormatNumberOptions = {
  locale?: string
  fractionDigits?: number
  precision?: number
}

const spaceLikeGroupSeparators = /[\u00a0\u202f]/g

export function getNumberFormatSeparators(locale = DEFAULT_NUMBER_LOCALE): { group: string; decimal: string } {
  const parts = new Intl.NumberFormat(locale).formatToParts(1000.1)
  const group = parts.find(part => part.type === 'group')?.value ?? ' '

  return {
    group: group.replace(spaceLikeGroupSeparators, ' '),
    decimal: parts.find(part => part.type === 'decimal')?.value ?? ',',
  }
}

const normalizeFormattedNumber = (formatted: string): string => formatted.replace(spaceLikeGroupSeparators, ' ')

export function formatNumber(value: number, options: FormatNumberOptions = {}): string {
  if (!Number.isFinite(value)) {
    return String(value)
  }

  const { locale = DEFAULT_NUMBER_LOCALE, fractionDigits, precision } = options

  if (fractionDigits !== undefined) {
    return normalizeFormattedNumber(
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping: true,
      }).format(value),
    )
  }

  if (precision !== undefined) {
    return normalizeFormattedNumber(
      new Intl.NumberFormat(locale, {
        minimumSignificantDigits: precision,
        maximumSignificantDigits: precision,
        useGrouping: true,
      }).format(value),
    )
  }

  return normalizeFormattedNumber(
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 20,
      useGrouping: true,
    }).format(value),
  )
}
