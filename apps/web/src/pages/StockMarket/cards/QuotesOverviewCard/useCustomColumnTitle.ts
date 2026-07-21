import { useTranslations } from '@/i18n'
import { type QuotesOverviewView } from './quotesOverviewViews'

export const useCustomColumnTitle = (view: QuotesOverviewView): string => {
  const { t } = useTranslations()
  const labels = t.dashboard.stockMarket

  switch (view) {
    case 'earnings-soon':
      return labels.earnings

    case 'high-upside':
      return labels.toPriceTarget

    case 'low-forward-pe':
      return labels.peAtTarget
  }
}
