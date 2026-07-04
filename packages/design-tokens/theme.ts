import { createTheme } from '@mui/material/styles'
import designTokens from './tokens.json'
import './theme.types'

const { color, font, radius, shadow, layout, card, table, breakpoint } = designTokens

const fontVariant = (variant: { size: number; weight: number; lineHeight: number }) => ({
  fontSize: variant.size,
  fontWeight: variant.weight,
  lineHeight: variant.lineHeight,
})

const domainColor = (main: string) => ({ main })

const muiShadows = [
  'none',
  shadow.xs,
  shadow.xs,
  shadow.sm,
  shadow.sm,
  shadow.sm,
  shadow.md,
  shadow.md,
  shadow.md,
  shadow.md,
  shadow.lg,
  shadow.lg,
  shadow.lg,
  shadow.lg,
  shadow.lg,
  shadow.lg,
  shadow.xl,
  shadow.xl,
  shadow.xl,
  shadow.xl,
  shadow.xl,
  shadow.xl,
  shadow.xl,
  shadow.xl,
  shadow.xl,
] as const

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  defaultColorScheme: 'dark',
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: color.primary,
          light: color.primaryLight,
          dark: color.primaryDark,
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: color.purple,
          contrastText: '#FFFFFF',
        },
        error: {
          main: color.danger,
          contrastText: '#FFFFFF',
        },
        warning: {
          main: color.warning,
          contrastText: '#FFFFFF',
        },
        success: {
          main: color.success,
          contrastText: '#FFFFFF',
        },
        info: {
          main: color.info,
          contrastText: '#FFFFFF',
        },
        background: {
          default: color.background,
          paper: color.surface,
        },
        text: {
          primary: color.textPrimary,
          secondary: color.textSecondary,
          disabled: color.textMuted,
        },
        divider: color.border,
        energy: domainColor(color.energy),
        temperature: domainColor(color.temperature),
        humidity: domainColor(color.humidity),
        air: domainColor(color.air),
        weather: domainColor(color.weather),
        media: domainColor(color.media),
        news: domainColor(color.news),
        jobs: domainColor(color.jobs),
      },
    },
  },
  typography: {
    fontFamily: font.family,
    display1: fontVariant(font.display1),
    display2: fontVariant(font.display2),
    h1: fontVariant(font.h1),
    h2: fontVariant(font.h2),
    h3: fontVariant(font.h3),
    body1: fontVariant(font.body),
    body2: fontVariant(font.bodySmall),
    subtitle1: fontVariant(font.bodyLarge),
    subtitle2: fontVariant(font.bodySmall),
    caption: fontVariant(font.caption),
    fontSize: font.body.size,
  },
  spacing: 4,
  shape: {
    borderRadius: radius.md,
  },
  shadows: [...muiShadows],
  breakpoints: {
    values: {
      xs: breakpoint.xs,
      sm: breakpoint.sm,
      md: breakpoint.md,
      lg: breakpoint.lg,
      xl: breakpoint.xl,
      '2xl': breakpoint['2xl'],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: color.background,
          color: color.textPrimary,
          padding: layout.paddingMobile,
          fontSize: font.body.size,
          lineHeight: font.body.lineHeight,
          maxWidth: layout.containerMax,
          margin: '0 auto',
          minHeight: '100%',
          [`@media (min-width:${breakpoint.md}px)`]: {
            padding: layout.paddingTablet,
          },
          [`@media (min-width:${breakpoint.lg}px)`]: {
            padding: layout.paddingDesktop,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: radius.xl,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: card.radius,
          border: `${designTokens.borderWidth.hairline}px solid ${card.borderColor}`,
          backgroundColor: color.surface,
          backgroundImage: `linear-gradient(180deg, ${color.surfaceElevated} 0%, ${color.surface} 52%, ${color.surface} 100%)`,
          boxShadow: `${shadow.card}, inset 0 1px 0 ${card.highlightTop}`,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: card.padding,
          '&:last-child': {
            paddingBottom: card.padding,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: color.border,
            },
            '&:hover fieldset': {
              borderColor: color.borderStrong,
            },
            '&.Mui-focused fieldset': {
              borderColor: color.primary,
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: table.cellPadding,
          borderBottomColor: color.border,
          color: color.textPrimary,
          '&:first-of-type': {
            paddingLeft: 0,
          },
          '&:last-of-type': {
            paddingRight: 0,
          },
        },
        head: {
          color: color.textSecondary,
          fontWeight: 500,
        },
      },
    },
  },
})
