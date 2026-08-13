import * as Sentry from '@sentry/react'
import { type FC, type ReactNode } from 'react'
import { isDevelopment } from '@repo/env'
import { GlobalErrorFallback } from './GlobalErrorFallback'

type GlobalErrorBoundaryProps = {
  children: ReactNode
}

export const GlobalErrorBoundary: FC<GlobalErrorBoundaryProps> = ({ children }) => {
  if (isDevelopment) {
    return children
  }

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => <GlobalErrorFallback error={error} onRetry={resetError} />}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
