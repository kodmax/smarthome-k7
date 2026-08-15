import { KnxLinkException } from 'js-knx'

export const KNX_READ_TIMEOUT_SENTRY_THRESHOLD = 5

export function isKnxReadTimeout(error: unknown): error is KnxLinkException & { code: 'READ_TIMEOUT' } {
  return error instanceof KnxLinkException && error.code === 'READ_TIMEOUT'
}

export function shouldCaptureKnxError(error: unknown): boolean {
  if (!isKnxReadTimeout(error)) {
    return true
  }

  return (error.details.consecutiveReadTimeouts ?? 0) >= KNX_READ_TIMEOUT_SENTRY_THRESHOLD
}
