import { getTranslations } from '@repo/i18n'
import { getRequestLocale } from '@/i18n/getRequestLocale'
import { EnergyMeterScreen } from './EnergyMeterScreen'

export default async function EnergyMeterPage() {
  const locale = await getRequestLocale()
  const t = getTranslations(locale)

  return <EnergyMeterScreen title={t.energyMeter.title} description={t.energyMeter.description} />
}
