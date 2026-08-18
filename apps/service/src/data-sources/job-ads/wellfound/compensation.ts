import type { JobAdCurrency } from '@repo/types'

const UNSUPPORTED_MARKERS = /₹|₦|\bAUD\b|\bCAD\b|\bCOP\b|\bINR\b/i
const NON_USD_SUFFIX_MARKERS = /\bAUD\b|\bCAD\b|\bCOP\b/i

type SupportedCurrency = Extract<JobAdCurrency, 'USD' | 'GBP' | 'EUR'>

const CURRENCY_SYMBOL: Record<SupportedCurrency, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
}

export type ParsedWellfoundSalary = {
  from: number
  to: number
  currency: SupportedCurrency
}

export type ParseCompensationResult = { ok: true; value: ParsedWellfoundSalary } | { ok: false }

function parseAmount(raw: string, suffix: string | undefined): number {
  const value = Number(raw)
  if (!Number.isFinite(value)) {
    return NaN
  }

  switch (suffix?.toLowerCase()) {
    case 'k':
      return value * 1_000
    case 'm':
      return value * 1_000_000
    default:
      return value
  }
}

function parseAmounts(salaryPart: string, currency: SupportedCurrency): number[] {
  const symbol = CURRENCY_SYMBOL[currency]
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`${escaped}(\\d+(?:\\.\\d+)?)\\s*([kKmM])?\\b`, 'g')
  const amounts: number[] = []

  for (const match of salaryPart.matchAll(regex)) {
    const amount = parseAmount(match[1] ?? '', match[2])
    if (Number.isFinite(amount)) {
      amounts.push(amount)
    }
  }

  return amounts
}

function detectCurrency(salaryPart: string): SupportedCurrency | null {
  if (UNSUPPORTED_MARKERS.test(salaryPart)) {
    return null
  }

  const hasUsd = salaryPart.includes('$')
  const hasGbp = salaryPart.includes('£')
  const hasEur = salaryPart.includes('€')
  const symbolCount = [hasUsd, hasGbp, hasEur].filter(Boolean).length

  if (symbolCount !== 1) {
    return null
  }

  if (hasUsd) {
    if (NON_USD_SUFFIX_MARKERS.test(salaryPart)) {
      return null
    }
    return 'USD'
  }

  if (hasGbp) {
    return 'GBP'
  }

  return 'EUR'
}

function parseSalaryPart(salaryPart: string): ParsedWellfoundSalary | null {
  const currency = detectCurrency(salaryPart)
  if (!currency) {
    return null
  }

  const amounts = parseAmounts(salaryPart, currency)
  if (amounts.length === 0) {
    return null
  }

  return {
    from: amounts[0]!,
    to: amounts[amounts.length - 1]!,
    currency,
  }
}

export function parseCompensation(compensation: string | null | undefined): ParseCompensationResult {
  const raw = compensation?.trim() ?? ''
  if (!raw) {
    return { ok: false }
  }

  const salaryPart = raw.split(' • ')[0]?.trim() ?? ''
  const salary = parseSalaryPart(salaryPart)
  if (!salary) {
    return { ok: false }
  }

  return { ok: true, value: salary }
}
