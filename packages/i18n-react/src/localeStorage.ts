export type LocaleStorageConfig<Locale extends string> = {
  storageKey: string
  locales: readonly Locale[]
  fallbackLocale: Locale
}

export type LocaleStorage<Locale extends string> = {
  isLocale: (value: string | null) => value is Locale
  getStoredLocale: () => Locale | null
  setStoredLocale: (locale: Locale) => void
  getDefaultLocale: () => Locale
}

export const createLocaleStorage = <Locale extends string>(
  config: LocaleStorageConfig<Locale>,
): LocaleStorage<Locale> => {
  const localeSet = new Set<string>(config.locales)

  const isLocale = (value: string | null): value is Locale => value !== null && localeSet.has(value)

  const getStoredLocale = (): Locale | null => {
    const stored = localStorage.getItem(config.storageKey)
    return isLocale(stored) ? stored : null
  }

  const setStoredLocale = (locale: Locale) => {
    localStorage.setItem(config.storageKey, locale)
  }

  const getDefaultLocale = (): Locale => {
    const browserLanguage = navigator.language.split('-')[0]
    return isLocale(browserLanguage) ? browserLanguage : config.fallbackLocale
  }

  return {
    isLocale,
    getStoredLocale,
    setStoredLocale,
    getDefaultLocale,
  }
}
