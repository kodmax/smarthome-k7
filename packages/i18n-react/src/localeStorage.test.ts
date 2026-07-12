import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createLocaleStorage } from './localeStorage'

const storageKey = 'test-locale'

describe('createLocaleStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  const storage = createLocaleStorage({
    storageKey,
    locales: ['en', 'pl', 'ru'],
    fallbackLocale: 'pl',
  })

  it('detects supported locales', () => {
    expect(storage.isLocale('en')).toBe(true)
    expect(storage.isLocale('de')).toBe(false)
    expect(storage.isLocale(null)).toBe(false)
  })

  it('stores and reads locale from localStorage', () => {
    storage.setStoredLocale('ru')
    expect(storage.getStoredLocale()).toBe('ru')
  })

  it('returns null for unsupported stored locale', () => {
    localStorage.setItem(storageKey, 'de')
    expect(storage.getStoredLocale()).toBeNull()
  })
})
