import type { CSSProperties } from 'react'

type PaletteColor = {
  main: string
  light?: string
  dark?: string
  contrastText?: string
}

declare module '@mui/material/styles' {
  interface Palette {
    energy: PaletteColor
    temperature: PaletteColor
    humidity: PaletteColor
    air: PaletteColor
    weather: PaletteColor
    media: PaletteColor
    news: PaletteColor
    jobs: PaletteColor
    surfaceElevated: PaletteColor
    borderStrong: PaletteColor
    cardHeaderBorder: PaletteColor
  }

  interface PaletteOptions {
    energy?: PaletteColor
    temperature?: PaletteColor
    humidity?: PaletteColor
    air?: PaletteColor
    weather?: PaletteColor
    media?: PaletteColor
    news?: PaletteColor
    jobs?: PaletteColor
    surfaceElevated?: PaletteColor
    borderStrong?: PaletteColor
    cardHeaderBorder?: PaletteColor
  }

  interface TypographyVariants {
    display1: CSSProperties
    display2: CSSProperties
  }

  interface TypographyVariantsOptions {
    display1?: CSSProperties
    display2?: CSSProperties
  }

  interface BreakpointOverrides {
    xs: true
    sm: true
    md: true
    lg: true
    xl: true
    '2xl': true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true
    display2: true
  }
}

export {}
