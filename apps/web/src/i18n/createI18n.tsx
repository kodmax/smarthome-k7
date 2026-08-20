import { createContext, type FC, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createLocaleStorage, type LocaleStorage, type LocaleStorageConfig } from './localeStorage'

export type I18nContextValue<Locale extends string> = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export type CreateI18nConfig<Locale extends string, Translations> = LocaleStorageConfig<Locale> & {
  getTranslations: (locale: Locale) => Translations
}

export type CreateI18nResult<Locale extends string, Translations> = LocaleStorage<Locale> & {
  I18nProvider: FC<{
    children: ReactNode
    initialLocale?: Locale
  }>
  useLocale: () => {
    locale: Locale
    setLocale: (locale: Locale) => void
  }
  useTranslations: () => {
    t: Translations
  }
}

export const createI18n = <Locale extends string, Translations>(
  config: CreateI18nConfig<Locale, Translations>,
): CreateI18nResult<Locale, Translations> => {
  const storage = createLocaleStorage(config)
  const I18nContext = createContext<I18nContextValue<Locale> | null>(null)

  const useI18nContext = () => {
    const context = useContext(I18nContext)

    if (context === null) {
      throw new Error('useLocale and useTranslations must be used within I18nProvider')
    }

    return context
  }

  const I18nProvider: FC<{
    children: ReactNode
    initialLocale?: Locale
  }> = ({ children, initialLocale }) => {
    const [locale, setLocaleState] = useState<Locale>(
      () => initialLocale ?? storage.getStoredLocale() ?? storage.getDefaultLocale(),
    )

    const setLocale = useCallback((nextLocale: Locale) => {
      setLocaleState(nextLocale)
      storage.setStoredLocale(nextLocale)
    }, [])

    useEffect(() => {
      document.documentElement.lang = locale
    }, [locale])

    const value = useMemo(
      () => ({
        locale,
        setLocale,
      }),
      [locale, setLocale],
    )

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  }

  const useLocale = () => {
    const { locale, setLocale } = useI18nContext()
    return { locale, setLocale }
  }

  const useTranslations = () => {
    const { locale } = useI18nContext()
    return { t: config.getTranslations(locale) }
  }

  return {
    ...storage,
    I18nProvider,
    useLocale,
    useTranslations,
  }
}
