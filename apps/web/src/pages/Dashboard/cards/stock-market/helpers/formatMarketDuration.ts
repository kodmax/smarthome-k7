export const formatMarketDuration = (remainingMs: number): string => {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))

  if (totalSeconds < 60) {
    return `${totalSeconds}s`
  }

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days}d`)
  }

  if (hours > 0) {
    parts.push(`${hours}g`)
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }

  return parts.length > 0 ? parts.join(' ') : '0m'
}
