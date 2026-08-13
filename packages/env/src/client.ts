/// <reference types="vite/client" />

export const isProduction = import.meta.env.MODE === 'production'

export const isDevelopment = !isProduction

export const appMode = import.meta.env.MODE ?? 'development'
