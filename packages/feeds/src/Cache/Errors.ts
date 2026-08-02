export class CorruptCacheError extends Error {
  constructor(sourceId: string, cause: SyntaxError) {
    super(`Cache file for data source "${sourceId}" contains invalid JSON`)
    this.name = 'CorruptCacheError'
    this.cause = cause
  }
}
