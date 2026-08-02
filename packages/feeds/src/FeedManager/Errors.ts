export class DuplicateDataSourceIdError extends Error {
  constructor(id: string) {
    super(`Data source id "${id}" is already registered with a different definition`)
    this.name = 'DuplicateDataSourceIdError'
  }
}
