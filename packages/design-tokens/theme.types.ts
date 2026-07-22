import type { CSSProperties } from 'react'

type PaletteColor = {
  main: string
  light?: string
  dark?: string
  contrastText?: string
}

declare module '@mui/material/styles' {
  interface CssThemeVariables {
    enabled: true
  }

  interface Palette {
    energy: PaletteColor
    temperature: PaletteColor
    humidity: PaletteColor
    air: PaletteColor
    weather: PaletteColor
    media: PaletteColor
    news: PaletteColor
    jobs: PaletteColor
    accentRed: PaletteColor
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
    accentRed?: PaletteColor
    surfaceElevated?: PaletteColor
    borderStrong?: PaletteColor
    cardHeaderBorder?: PaletteColor
  }

  interface TypographyVariants {
    display1: CSSProperties
    display2: CSSProperties
    metric: CSSProperties
    metricLg: CSSProperties
    status: CSSProperties
    timerDigit: CSSProperties
    timerValue: CSSProperties
    sectionLabel: CSSProperties
    sideMenuLogo: CSSProperties
    sideMenuBrandTitle: CSSProperties
    sideMenuBrandSubtitle: CSSProperties
    sideMenuSectionLabel: CSSProperties
  }

  interface TypographyVariantsOptions {
    display1?: CSSProperties
    display2?: CSSProperties
    metric?: CSSProperties
    metricLg?: CSSProperties
    status?: CSSProperties
    timerDigit?: CSSProperties
    timerValue?: CSSProperties
    sectionLabel?: CSSProperties
    sideMenuLogo?: CSSProperties
    sideMenuBrandTitle?: CSSProperties
    sideMenuBrandSubtitle?: CSSProperties
    sideMenuSectionLabel?: CSSProperties
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
    metric: true
    metricLg: true
    status: true
    timerDigit: true
    timerValue: true
    sectionLabel: true
    sideMenuLogo: true
    sideMenuBrandTitle: true
    sideMenuBrandSubtitle: true
    sideMenuSectionLabel: true
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    panel: true
    sideMenu: true
  }
}

declare module '@mui/material/ToggleButtonGroup' {
  interface ToggleButtonGroupProps {
    pill?: boolean
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    energy: true
    temperature: true
    humidity: true
    air: true
    weather: true
    media: true
    news: true
    jobs: true
  }
}

export {}
