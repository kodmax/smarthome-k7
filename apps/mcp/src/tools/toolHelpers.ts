import type { FeedStore } from '../feeds/FeedStore.js'

export function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] }
}

export function feedUnavailable(feedStore: FeedStore, label: string) {
  const status = feedStore.isConnected() ? 'połączony, czekam na FEED' : 'brak połączenia z Apollo'
  return textResult(`Brak danych: ${label} (${status}). Czy apps/service działa?`)
}

export function serviceUnavailable(feedStore: FeedStore) {
  const status = feedStore.isConnected() ? 'połączony, czekam na FEED' : 'brak połączenia z Apollo'
  return textResult(`Brak danych dashboardu (${status}). Czy apps/service działa?`)
}
