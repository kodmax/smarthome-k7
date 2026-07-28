import { MarketIndexQuote } from '@repo/types'
import { withScraperSource } from '@/utils/scraper'
import { parseQuoteFieldsFromDocument } from './parseQuoteFromDocument'

export const parseMarketIndexQuoteFromDocument = (
  document: Document,
  symbol: string,
  title: string,
): MarketIndexQuote =>
  withScraperSource(`cnbc:${symbol}`, () => ({
    symbol,
    title,
    ...parseQuoteFieldsFromDocument(document),
  }))
