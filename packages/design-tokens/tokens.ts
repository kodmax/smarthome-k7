import shared from './tokens.json'
import darkScheme from './tokens.dark.json'
import lightScheme from './tokens.light.json'

const schemes = {
  dark: darkScheme,
  light: lightScheme,
} as const

export type ColorScheme = keyof typeof schemes

export const tokens = {
  shared,
  schemes,
}

export function getSchemeTokens(scheme: ColorScheme) {
  return schemes[scheme]
}

export function buildDesignTokens(scheme: ColorScheme = 'dark') {
  const schemeTokens = schemes[scheme]

  return {
    ...shared,
    ...schemeTokens,
    shared,
    schemes,
  }
}

export const designTokens = buildDesignTokens('dark')

/** Pixel gap between cards on dashboard-style grid layouts. */
export const cardGridGap = shared.layout.cardGridGap

/** MUI Grid `spacing` value matching {@link cardGridGap} (gap = spacing × theme spacing unit). */
export const cardGridSpacing = shared.layout.cardGridGap / shared.space[1]

export type DesignTokens = ReturnType<typeof buildDesignTokens>
