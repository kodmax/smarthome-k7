export function isExpired(timestamp: number, ttlMs?: number): boolean {
  return ttlMs !== undefined && ttlMs > 0 && Date.now() - timestamp > ttlMs
}
