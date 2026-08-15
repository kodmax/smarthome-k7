type YahooChartMeta = {
  regularMarketPrice?: number
  chartPreviousClose?: number
}

export type YahooChartResponse = {
  chart: {
    result: Array<{
      meta: YahooChartMeta
    }> | null
  }
}

export type ChartQuoteRequest = {
  symbol: string
  title: string
  chartSymbol: string
}

const YAHOO_CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart'

export const buildChartQuoteUrl = (chartSymbol: string): string =>
  `${YAHOO_CHART_URL}/${encodeURIComponent(chartSymbol)}?interval=1d&range=1d`

export const parseChartQuote = (response: YahooChartResponse, { symbol, title, chartSymbol }: ChartQuoteRequest) => {
  const meta = response.chart.result?.[0]?.meta
  const price = meta?.regularMarketPrice
  const previousClose = meta?.chartPreviousClose

  if (price === undefined || previousClose === undefined) {
    throw new Error(`missing price data for ${chartSymbol}`)
  }

  const netChange = price - previousClose
  const percentageChange = (netChange / previousClose) * 100

  return {
    symbol,
    title,
    price,
    netChange,
    percentageChange,
  }
}
