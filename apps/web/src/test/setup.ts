import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

const createLocalStorage = () => {
  let store: Record<string, string> = {}

  return {
    get length() {
      return Object.keys(store).length
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null
    },
    getItem(key: string) {
      return store[key] ?? null
    },
    setItem(key: string, value: string) {
      store[key] = value
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
    },
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: createLocalStorage(),
  configurable: true,
})

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
  useCommand: vi.fn(() => vi.fn()),
  fetchJobAdCvMatch: vi.fn(),
}))

afterEach(() => {
  localStorage.clear()
  cleanup()
})
