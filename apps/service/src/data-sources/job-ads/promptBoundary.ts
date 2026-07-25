import { randomBytes } from 'node:crypto'

export function createRandomBoundaryToken(): string {
  return randomBytes(16).toString('hex')
}
