import { type FC, useEffect } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { isDevelopment } from '@/env'
import { captureProductionError } from './captureProductionError'
import { GlobalErrorFallback } from './GlobalErrorFallback'

function toDisplayError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  if (isRouteErrorResponse(error)) {
    const statusText = error.statusText || 'Unknown error'
    return new Error(`${error.status} ${statusText}`)
  }

  return new Error('Unknown route error')
}

export const RouteErrorPage: FC<Record<string, never>> = () => {
  const routeError = useRouteError()
  const displayError = toDisplayError(routeError)

  useEffect(() => {
    captureProductionError(routeError)
  }, [routeError])

  if (isDevelopment) {
    throw displayError
  }

  return <GlobalErrorFallback error={displayError} />
}
