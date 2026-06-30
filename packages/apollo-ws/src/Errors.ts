export class NonErrorException extends Error {}

export class DuplicateDataSourceIdError extends Error {
  constructor(id: string) {
    super(`Data source id "${id}" is already registered with a different definition`)
    this.name = 'DuplicateDataSourceIdError'
  }
}

export class NoRecentContent extends NonErrorException {
  constructor() {
    super('No recent content')
  }
}

export class CorruptCacheError extends Error {
  constructor(sourceId: string, cause: SyntaxError) {
    super(`Cache file for data source "${sourceId}" contains invalid JSON`)
    this.name = 'CorruptCacheError'
    this.cause = cause
  }
}
