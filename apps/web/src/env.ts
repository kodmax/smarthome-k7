/**
 * Vite client equivalent of backend `process.env.NODE_ENV === 'production'`.
 */
export const isProduction = import.meta.env.MODE === 'production'

/**
 * Vite client equivalent of backend `process.env.NODE_ENV !== 'production'`.
 */
export const isDevelopment = !isProduction
