export class NoRecentContent extends Error {
  constructor() {
    super('No recent content')
  }
}

export class DataSourceNotFound extends Error {
  constructor() {
    super('Data source not found in the registry')
  }
}
