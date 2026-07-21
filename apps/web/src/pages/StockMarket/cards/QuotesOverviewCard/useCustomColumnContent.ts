import { ColumnContent } from '../components/StockQuote'
import { EarningsDate, EG, PEAtPT } from './cells'
import { type QuotesOverviewView } from './quotesOverviewViews'

export const useCustomColumnContent = (view: QuotesOverviewView): ColumnContent => {
  switch (view) {
    case 'earnings-soon':
      return EarningsDate

    case 'high-upside':
      return EG

    case 'low-forward-pe':
      return PEAtPT
  }
}
