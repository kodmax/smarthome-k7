const CONTENT_PREVIEW_LENGTH = 63

export class FetchError extends Error {
  public readonly contentPreview?: string

  public constructor(
    public url: string,
    public statusText: string,
    public statusCode: number,
    content?: string,
  ) {
    const status = statusText ? `${statusCode} ${statusText}` : String(statusCode)
    super(`${status} — ${url}`)
    this.name = 'FetchError'

    if (content !== undefined) {
      this.contentPreview = content.slice(0, CONTENT_PREVIEW_LENGTH)
    }
  }
}
