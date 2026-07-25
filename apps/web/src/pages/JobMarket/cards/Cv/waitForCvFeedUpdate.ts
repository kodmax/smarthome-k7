import { subscribe } from '@repo/feed-client'
import { type CvFeed } from '@repo/types'

const CV_UPLOAD_TIMEOUT_MS = 30_000

export function waitForCvFeedUpdate(previousModifiedAt: string | null): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      unsubscribe()
      reject(new Error('CV upload timed out waiting for feed update'))
    }, CV_UPLOAD_TIMEOUT_MS)

    const unsubscribe = subscribe('cv', ({ payload }) => {
      const feed = payload as CvFeed
      const nextModifiedAt = feed.cv?.modifiedAt ?? null
      const isUpdated =
        previousModifiedAt === null
          ? feed.cv !== null
          : nextModifiedAt !== null && nextModifiedAt !== previousModifiedAt

      if (!isUpdated) {
        return
      }

      clearTimeout(timeout)
      unsubscribe()
      resolve()
    })
  })
}
