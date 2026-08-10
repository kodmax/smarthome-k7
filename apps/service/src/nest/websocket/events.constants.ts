import type { ErrorHandler, FeedEvents } from '@repo/feeds'

export const FEED_EVENTS = Symbol('FEED_EVENTS')
export const WS_ON_ERROR = Symbol('WS_ON_ERROR')

export type EventsModuleDeps = {
  feedEvents: FeedEvents
  onError: ErrorHandler
}
