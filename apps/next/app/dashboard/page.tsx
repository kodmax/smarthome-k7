import { getTranslations } from '@repo/i18n'
import { getRequestLocale } from '@/i18n/getRequestLocale'
import { DashboardScreen } from './DashboardScreen'

export default async function DashboardPage() {
  const locale = await getRequestLocale()
  const t = getTranslations(locale)

  return <DashboardScreen title={t.dashboard.title} description={t.dashboard.description} />
}
