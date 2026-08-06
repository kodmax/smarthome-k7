import type { Sql } from '@repo/db'
import { vi } from 'vitest'

export function mockSql(...responses: unknown[]): Sql {
  let index = 0

  const fn = vi.fn((first: unknown) => {
    if (Array.isArray(first) && !('raw' in first)) {
      return first
    }

    return Promise.resolve(responses[index++] ?? [])
  })

  return Object.assign(fn, { json: (value: unknown) => value }) as unknown as Sql
}

export function mockDeleteResult(count: number) {
  return Object.assign([], { count })
}
