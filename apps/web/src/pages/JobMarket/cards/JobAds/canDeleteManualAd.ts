export const MANUAL_DELETE_WINDOW_MS = 24 * 60 * 60 * 1000

export function canDeleteManualAd(addedAt: string | null | undefined, now = Date.now()): boolean {
  if (addedAt === null || addedAt === undefined) {
    return false
  }

  const added = new Date(addedAt).getTime()
  if (Number.isNaN(added)) {
    return false
  }

  return now - added < MANUAL_DELETE_WINDOW_MS
}
