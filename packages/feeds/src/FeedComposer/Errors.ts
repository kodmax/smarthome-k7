export class FeedNotFound extends Error {
  readonly feedId: string

  constructor(feedId: string) {
    super(`Feed not found: ${feedId}`)
    this.name = 'FeedNotFound'
    this.feedId = feedId
  }
}
