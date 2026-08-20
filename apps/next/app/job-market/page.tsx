import { getTranslations } from '@repo/i18n'
import { getRequestLocale } from '@/i18n/getRequestLocale'
import { JobMarketScreen } from './JobMarketScreen'

export default async function JobMarketPage() {
  const locale = await getRequestLocale()
  const t = getTranslations(locale)

  return <JobMarketScreen title={t.jobMarket.title} description={t.jobMarket.description} />
}
