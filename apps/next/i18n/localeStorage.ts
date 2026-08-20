const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

export type LocaleStorageConfig<Locale extends string> = {
  storageKey: string
  cookieKey: string
  locales: readonly Locale[]
  fallbackLocale: Locale
}

export type LocaleStorage<Locale extends string> = {
  isLocale: (value: string | null) => value is Locale
  getStoredLocale: () => Locale | null
  getCookieLocale: () => Locale | null
  setStoredLocale: (locale: Locale) => void
  syncCookieFromStorage: () => void
  getDefaultLocale: () => Locale
}

const readCookie = (key: string): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

const writeCookie = (key: string, value: string) => {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

export const createLocaleStorage = <Locale extends string>(
  config: LocaleStorageConfig<Locale>,
): LocaleStorage<Locale> => {
  const localeSet = new Set<string>(config.locales)

  const isLocale = (value: string | null): value is Locale => value !== null && localeSet.has(value)

  const getStoredLocale = (): Locale | null => {
    if (typeof localStorage === 'undefined') {
      return null
    }

    const stored = localStorage.getItem(config.storageKey)
    return isLocale(stored) ? stored : null
  }

  const getCookieLocale = (): Locale | null => {
    const stored = readCookie(config.cookieKey)
    return isLocale(stored) ? stored : null
  }

  const setStoredLocale = (locale: Locale) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(config.storageKey, locale)
    }

    writeCookie(config.cookieKey, locale)
  }

  const syncCookieFromStorage = () => {
    const stored = getStoredLocale()
    if (stored === null) {
      return
    }

    if (getCookieLocale() !== stored) {
      writeCookie(config.cookieKey, stored)
    }
  }

  const getDefaultLocale = (): Locale => {
    const browserLanguage = navigator.language.split('-')[0]
    return isLocale(browserLanguage) ? browserLanguage : config.fallbackLocale
  }

  return {
    isLocale,
    getStoredLocale,
    getCookieLocale,
    setStoredLocale,
    syncCookieFromStorage,
    getDefaultLocale,
  }
}
