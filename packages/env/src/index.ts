export const isProduction = process.env.NODE_ENV === 'production'

export const isDevelopment = !isProduction

export const appMode = process.env.NODE_ENV ?? 'development'
