import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('@repo/feed-client', () => ({
  useFeed: vi.fn(),
  useCommand: vi.fn(() => vi.fn()),
}))

afterEach(() => {
  cleanup()
})
