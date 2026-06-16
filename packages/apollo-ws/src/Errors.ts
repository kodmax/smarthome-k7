export class NonErrorException extends Error {}

export class NoRecentContent extends NonErrorException {
  constructor() {
    super('No recent content')
  }
}
