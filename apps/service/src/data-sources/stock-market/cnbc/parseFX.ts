import { ForexQuote } from '@repo/types'
import { getNumberContent } from '@/utils/get-number-content'
import { requireText, withScraperSource } from '@/utils/scraper'

const parseChangeText = (changeText: string): Pick<ForexQuote, 'netChange' | 'percentageChange'> => {
  const match = changeText.trim().match(/^(\+?-?[0-9,.]+)\s*\((\+?-?[0-9,.]+)%\)$/)
  if (match === null) {
    throw new Error(`change text "${changeText}" is not in expected format`)
  }

  return {
    netChange: Number(match[1].replaceAll(',', '')),
    percentageChange: Number(match[2].replaceAll(',', '')),
  }
}

export const parseFXFromDocument = (document: Document, symbol: string, title: string): ForexQuote =>
  withScraperSource(`cnbc:${symbol}`, () => {
    const price = getNumberContent(document, '.QuoteStrip-lastPrice')
    const changeText = requireText(document, '[class*="QuoteStrip-change"]', 'quote change')

    return {
      symbol,
      title,
      price,
      ...parseChangeText(changeText),
    }
  })
