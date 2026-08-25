import type { Sql } from '@repo/db'
import { rootLogger } from '@repo/logger'
import { z } from 'zod'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { captureInvalidInput, captureProductionError } from '@/sentry'

const logger = rootLogger.child({ component: 'stock-market' })

export const STOCK_MARKET_PREFERENCES_SCOPE = 'stock-market'
export const TICKERS_PREFERENCE_KEY = 'tickers'

export class StockMarketTickersNotConfiguredError extends Error {
  constructor(reason: 'missing' | 'invalid') {
    super(
      reason === 'missing'
        ? 'stock-market: tickers preference is not configured'
        : 'stock-market: tickers preference is invalid',
    )
    this.name = 'StockMarketTickersNotConfiguredError'
  }
}

type PreferenceRow = {
  value: unknown
}

const stockMarketTickersSchema = z.array(z.string().min(1)).min(1)

export function parseStockMarketTickers(value: unknown): string[] | null {
  if (value === null || value === undefined) {
    return null
  }

  const result = stockMarketTickersSchema.safeParse(value)
  if (!result.success) {
    const itemIssue = result.error.issues.find((issue) => issue.path.length > 0)
    if (itemIssue !== undefined && Array.isArray(value)) {
      const index = itemIssue.path[0]
      captureInvalidInput(
        'stock-market: invalid ticker symbol',
        typeof index === 'number' ? value[index] : value,
      )
      return null
    }

    captureInvalidInput('stock-market: invalid tickers value', value)
    return null
  }

  const seen = new Set<string>()
  const tickers: string[] = []

  for (const item of result.data) {
    const symbol = item.toUpperCase()
    if (seen.has(symbol)) {
      captureInvalidInput('stock-market: duplicate ticker symbol', symbol)
      return null
    }

    seen.add(symbol)
    tickers.push(symbol)
  }

  return tickers
}

export async function loadStockMarketTickers(db: Sql): Promise<string[]> {
  try {
    const rows = await observeDbQuery(
      'select',
      'preferences',
      () =>
        db<PreferenceRow[]>`
        select value
        from preferences
        where scope = ${STOCK_MARKET_PREFERENCES_SCOPE}
          and preference_key = ${TICKERS_PREFERENCE_KEY}
      `,
    )

    const row = rows[0]
    if (row === undefined) {
      throw new StockMarketTickersNotConfiguredError('missing')
    }

    const parsed = parseStockMarketTickers(row.value)
    if (parsed === null) {
      throw new StockMarketTickersNotConfiguredError('invalid')
    }

    return parsed
  } catch (error) {
    if (error instanceof StockMarketTickersNotConfiguredError) {
      throw error
    }

    logger.error({ err: error }, 'Failed to load stock market tickers preference')
    captureProductionError(error)
    throw error
  }
}
