export class FetchError<T> extends Error {
  public constructor(
    public statusText: string,
    public statusCode: number,
    public content?: T,
  ) {
    super(statusText)
  }
}
