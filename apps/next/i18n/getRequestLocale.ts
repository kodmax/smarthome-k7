import { cookies } from 'next/headers'
import { LOCALE_COOKIE_KEY, resolveAppLocale, type AppLocale } from '@repo/i18n'

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies()
  return resolveAppLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value)
}
