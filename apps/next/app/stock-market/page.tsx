import { getTranslations } from '@repo/i18n'
import { getRequestLocale } from '@/i18n/getRequestLocale'
import { StockMarketScreen } from './StockMarketScreen'

export default async function StockMarketPage() {
  const locale = await getRequestLocale()
  const t = getTranslations(locale)

  return <StockMarketScreen title={t.stockMarket.title} description={t.stockMarket.description} />
}
