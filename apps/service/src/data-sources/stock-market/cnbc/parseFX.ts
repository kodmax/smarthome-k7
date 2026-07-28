import { ForexQuote } from '@repo/types'
import { withScraperSource } from '@/utils/scraper'
import { parseQuoteFieldsFromDocument } from './parseQuoteFromDocument'

export const parseFXFromDocument = (document: Document, symbol: string, title: string): ForexQuote =>
  withScraperSource(`cnbc:${symbol}`, () => ({
    symbol,
    title,
    ...parseQuoteFieldsFromDocument(document),
  }))
