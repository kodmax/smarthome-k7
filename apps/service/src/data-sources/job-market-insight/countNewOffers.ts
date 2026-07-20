import { JobAd } from '@repo/types'

export const NEW_OFFERS_WINDOW_DAYS = 7

export const countNewOffers = (ads: JobAd[], now: Date = new Date()): number => {
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - NEW_OFFERS_WINDOW_DAYS)

  return ads.filter(ad => new Date(ad.publishedAt) >= cutoff).length
}
