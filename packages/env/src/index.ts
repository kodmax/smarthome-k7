// Bracket access — Bun inlines dot access at bundle time; brackets read NODE_ENV when the process starts.
export const isProduction = process.env['NODE_ENV'] === 'production'

export const isDevelopment = !isProduction

export const appMode = process.env['NODE_ENV'] ?? 'development'
