import { createTheme, type Theme } from '@mui/material/styles'
import { tokens } from './tokens'
import './theme.types'

const { shared, schemes } = tokens
const darkScheme = schemes.dark
const { font, radius, layout, breakpoint, borderWidth, icon } = shared
const { bodyPadding } = layout

const below2xlMediaQuery = `@media (max-width:${breakpoint['2xl'] - 0.05}px)`

type SchemeTokens = typeof darkScheme

const fontVariant = (variant: { size: number; weight: number; lineHeight: number }) => ({
  fontSize: variant.size,
  fontWeight: variant.weight,
  lineHeight: variant.lineHeight,
})

const headingVariant = (variant: { size: number; weight: number; lineHeight: number }) => ({
  ...fontVariant(variant),
  color: 'var(--mui-palette-text-secondary)',
})

const touchTargetBelow2xl = (theme: Theme) => ({
  minHeight: 72,
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2.5),
  fontSize: font.bodyLarge.size,
})

const iconTouchTargetBelow2xl = (variant: 'medium' | 'small') => {
  const buttonSize = Math.round((variant === 'small' ? 34 : 40) * 1.5)
  const iconSize = Math.round((variant === 'small' ? 20 : 24) * 1.5)

  return {
    width: buttonSize,
    height: buttonSize,
    minWidth: buttonSize,
    minHeight: buttonSize,
    '& svg': {
      width: iconSize,
      height: iconSize,
    },
  }
}

const domainColor = (main: string) => ({ main })

const buildPalette = (scheme: SchemeTokens) => {
  const { color, card } = scheme

  return {
    primary: {
      main: color.primary,
      light: color.primaryLight,
      dark: color.primaryDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: color.weather,
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
    surfaceElevated: domainColor(color.surfaceElevated),
    borderStrong: domainColor(color.borderStrong),
    cardHeaderBorder: domainColor(card.headerBorderColor),
  }
}

const cardRootStyles = (scheme: SchemeTokens) => ({
  borderRadius: scheme.card.radius,
  boxShadow: `${scheme.shadow.card}, inset 0 1px 0 ${scheme.card.highlightTop}`,
})

const muiShadows = [
  'none',
  darkScheme.shadow.xs,
  darkScheme.shadow.xs,
  darkScheme.shadow.sm,
  darkScheme.shadow.sm,
  darkScheme.shadow.sm,
  darkScheme.shadow.md,
  darkScheme.shadow.md,
  darkScheme.shadow.md,
  darkScheme.shadow.md,
  darkScheme.shadow.lg,
  darkScheme.shadow.lg,
  darkScheme.shadow.lg,
  darkScheme.shadow.lg,
  darkScheme.shadow.lg,
  darkScheme.shadow.lg,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
  darkScheme.shadow.xl,
] as const

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  defaultColorScheme: 'dark',
  colorSchemes: {
    dark: {
      palette: buildPalette(schemes.dark),
    },
    light: {
      palette: buildPalette(schemes.light),
    },
  },
  typography: {
    fontFamily: font.family,
    display1: fontVariant(font.display1),
    display2: fontVariant(font.display2),
    h1: headingVariant(font.h1),
    h2: headingVariant(font.h2),
    h3: headingVariant(font.h3),
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
          backgroundColor: 'var(--mui-palette-background-default)',
          color: 'var(--mui-palette-text-primary)',
          padding: `${bodyPadding.top}px ${bodyPadding.right}px ${bodyPadding.bottom}px ${bodyPadding.left}px`,
          fontSize: font.body.size,
          lineHeight: font.body.lineHeight,
          maxWidth: layout.containerMax,
          margin: '0 auto',
          minHeight: '100%',
          [below2xlMediaQuery]: {
            padding: `${bodyPadding.top}px ${bodyPadding.right}px ${bodyPadding.bottom}px ${bodyPadding.leftBelow2xl}px`,
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
        sizeLarge: ({ theme }: { theme: Theme }) => ({
          [theme.breakpoints.down('2xl')]: {
            ...touchTargetBelow2xl(theme),
            '& .MuiButton-startIcon svg': {
              width: icon.sizeMd,
              height: icon.sizeMd,
            },
          },
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        sizeLarge: ({ theme }: { theme: Theme }) => ({
          [theme.breakpoints.down('2xl')]: touchTargetBelow2xl(theme),
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeLarge: ({ theme }: { theme: Theme }) => ({
          [theme.breakpoints.down('2xl')]: iconTouchTargetBelow2xl('small'),
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          border: `${borderWidth.hairline}px solid ${theme.vars.palette.cardHeaderBorder.main}`,
          backgroundColor: theme.vars.palette.background.paper,
          backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.surfaceElevated.main} 0%, ${theme.vars.palette.background.paper} 50%, ${theme.vars.palette.background.paper} 100%)`,
          ...theme.applyStyles('dark', cardRootStyles(schemes.dark)),
          ...theme.applyStyles('light', cardRootStyles(schemes.light)),
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: darkScheme.card.padding,
          '&:last-child': {
            paddingBottom: darkScheme.card.padding,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.vars.palette.divider,
            },
            '&:hover fieldset': {
              borderColor: theme.vars.palette.borderStrong.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.vars.palette.primary.main,
            },
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          padding: darkScheme.table.cellPadding,
          borderBottomColor: theme.vars.palette.divider,
          color: theme.vars.palette.text.primary,
          '&:first-of-type': {
            paddingLeft: 0,
          },
          '&:last-of-type': {
            paddingRight: 0,
          },
        }),
        head: ({ theme }: { theme: Theme }) => ({
          color: theme.vars.palette.text.secondary,
          fontWeight: 600,
          fontSize: font.body.size - 2,
          fontVariant: 'small-caps',
        }),
      },
    },
  },
})
