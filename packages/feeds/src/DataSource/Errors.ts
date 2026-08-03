export class DataSourceNotFound extends Error {
  constructor() {
    super('Data source not found in the registry')
  }
}

export class DuplicateDataSourceIdError extends Error {
  constructor(id: string) {
    super(`Data source id "${id}" is already registered`)
  }
}
