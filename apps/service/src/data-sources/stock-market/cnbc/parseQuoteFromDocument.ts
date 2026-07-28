import { getNumberContent } from '@/utils/get-number-content'
import { requireText } from '@/utils/scraper'

export type QuoteFields = {
  price: number
  netChange: number
  percentageChange: number
}

const CHANGE_SELECTOR = '.QuoteStrip-changeUp, .QuoteStrip-changeDown, .QuoteStrip-unchanged'

type FinancialQuoteJson = {
  '@type'?: string
  price?: string
  priceChange?: string
  priceChangePercent?: string
}

const parseNumericField = (value: string): number => Number(value.replaceAll(',', ''))

const parseChangeText = (changeText: string): Pick<QuoteFields, 'netChange' | 'percentageChange'> => {
  const match = changeText.trim().match(/^(\+?-?[0-9,.]+)\s*\((\+?-?[0-9,.]+)%\)$/)
  if (match === null) {
    throw new Error(`change text "${changeText}" is not in expected format`)
  }

  return {
    netChange: parseNumericField(match[1]),
    percentageChange: parseNumericField(match[2]),
  }
}

const isFinancialQuoteJson = (value: unknown): value is FinancialQuoteJson =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as FinancialQuoteJson)['@type'] === 'string' &&
  (value as FinancialQuoteJson)['@type']!.includes('FinancialQuote')

const parseFinancialQuoteJson = (document: Document): QuoteFields | null => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]')

  for (const script of scripts) {
    if (typeof script.textContent !== 'string' || script.textContent.trim() === '') {
      continue
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(script.textContent)
    } catch {
      continue
    }

    const candidates = Array.isArray(parsed) ? parsed : [parsed]
    const financialQuote = candidates.find(isFinancialQuoteJson)
    if (financialQuote === undefined) {
      continue
    }

    const { price, priceChange, priceChangePercent } = financialQuote
    if (typeof price !== 'string' || typeof priceChange !== 'string' || typeof priceChangePercent !== 'string') {
      continue
    }

    return {
      price: parseNumericField(price),
      netChange: parseNumericField(priceChange),
      percentageChange: parseNumericField(priceChangePercent),
    }
  }

  return null
}

const parseChangeTextFromDom = (document: Document): Pick<QuoteFields, 'netChange' | 'percentageChange'> => {
  const root = document.querySelector('.QuoteStrip-lastPriceStripContainer') ?? document
  const changeText = requireText(root, CHANGE_SELECTOR, 'quote change')

  return parseChangeText(changeText)
}

export const parseQuoteFieldsFromDocument = (document: Document): QuoteFields => {
  const fromJson = parseFinancialQuoteJson(document)
  if (fromJson !== null) {
    return fromJson
  }

  return {
    price: getNumberContent(document, '.QuoteStrip-lastPrice'),
    ...parseChangeTextFromDom(document),
  }
}
