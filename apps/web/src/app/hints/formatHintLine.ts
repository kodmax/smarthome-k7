import { formatNumber } from '@/helpers/formatNumber'

export const formatHintLine = (template: string, value: string | number, fractionDigits?: number): string => {
  const formatted =
    typeof value === 'number'
      ? formatNumber(value, fractionDigits !== undefined ? { fractionDigits } : undefined)
      : value

  return template.replace('{value}', formatted)
}
