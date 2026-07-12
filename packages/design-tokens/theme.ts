import { createTheme, type Theme } from '@mui/material/styles'
import { tokens } from './tokens'
import './theme.types'

const { shared, schemes } = tokens
const darkScheme = schemes.dark
const { font, radius, layout, breakpoint, borderWidth, icon, components, space, transition } = shared
const { bodyPadding } = layout

const below2xlMediaQuery = `@media (max-width:${breakpoint['2xl'] - 0.05}px)`

const scaleBelow2xl = (value: number) => Math.round(value * components.sideMenu.below2xlScale)

export { scaleBelow2xl }

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

const domainColor = (main: string) => ({ main, contrastText: '#FFFFFF' })

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
    caption: {
      ...fontVariant(font.caption),
      color: 'var(--mui-palette-text-secondary)',
    },
    metric: fontVariant(font.h3),
    metricLg: fontVariant(font.metricLg),
    status: fontVariant(font.status),
    timerDigit: {
      ...fontVariant(font.status),
      fontFamily: font.familyMono,
      letterSpacing: components.progressRing.timerLetterSpacing,
    },
    timerValue: {
      ...fontVariant(font.display2),
      fontFamily: font.familyMono,
      letterSpacing: components.progressRing.timerLetterSpacing,
    },
    sectionLabel: {
      color: 'var(--mui-palette-text-secondary)',
      fontWeight: components.sectionLabel.fontWeight,
      letterSpacing: components.sectionLabel.letterSpacing,
      textTransform: 'uppercase',
      fontSize: font.caption.size,
      marginBottom: `${components.sectionLabel.marginBottom}px`,
      display: 'block',
    },
    sideMenuLogo: {
      fontWeight: 700,
      fontSize: components.sideMenu.logoFontSize,
      color: 'var(--mui-palette-text-primary)',
      lineHeight: 1,
      [below2xlMediaQuery]: {
        fontSize: scaleBelow2xl(components.sideMenu.logoFontSize),
      },
    },
    sideMenuBrandTitle: {
      fontWeight: 600,
      fontSize: font.bodyLarge.size,
      lineHeight: 1.2,
      display: 'block',
      whiteSpace: 'nowrap',
      [below2xlMediaQuery]: {
        fontSize: scaleBelow2xl(font.bodyLarge.size),
      },
    },
    sideMenuBrandSubtitle: {
      color: 'var(--mui-palette-text-secondary)',
      fontSize: font.bodySmall.size,
      lineHeight: 1.3,
      display: 'block',
      whiteSpace: 'nowrap',
      [below2xlMediaQuery]: {
        fontSize: scaleBelow2xl(font.bodySmall.size),
      },
    },
    sideMenuSectionLabel: {
      color: 'var(--mui-palette-text-disabled)',
      fontWeight: components.sectionLabel.fontWeight,
      letterSpacing: components.sectionLabel.letterSpacing,
      textTransform: 'uppercase',
      fontSize: font.caption.size,
      display: 'block',
      whiteSpace: 'nowrap',
      [below2xlMediaQuery]: {
        fontSize: scaleBelow2xl(font.caption.size),
      },
    },
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
    MuiToggleButtonGroup: {
      variants: [
        {
          props: { pill: true },
          style: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.vars.palette.background.default,
            borderRadius: `${radius.full}px`,
            padding: theme.spacing(0.5),
            '& .MuiToggleButton-root': {
              flex: 1,
              border: 'none',
              borderRadius: `${radius.full}px`,
              fontWeight: components.sectionLabel.fontWeight,
              color: theme.vars.palette.text.secondary,
              '&.Mui-selected': {
                backgroundColor: theme.vars.palette.energy.main,
                color: theme.vars.palette.common.white,
                '&:hover': {
                  backgroundColor: theme.vars.palette.energy.main,
                },
              },
            },
          }),
        },
      ],
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      variants: [
        {
          props: { variant: 'panel' },
          style: ({ theme }: { theme: Theme }) => ({
            border: '1px solid',
            borderColor: theme.vars.palette.divider,
            borderRadius: `${components.panel.borderRadius}px`,
            backgroundColor: theme.vars.palette.background.paper,
            padding: `${components.panel.padding}px`,
            height: '100%',
          }),
        },
        {
          props: { variant: 'sideMenu' },
          style: ({ theme }: { theme: Theme }) => {
            const { sideMenu } = components
            const scaled = scaleBelow2xl

            return {
              width: 'max-content',
              minWidth: sideMenu.drawerWidth,
              borderRadius: `${sideMenu.borderRadius}px`,
              border: '1px solid',
              borderColor: theme.vars.palette.divider,
              backgroundColor: theme.vars.palette.background.paper,
              overflow: 'hidden',
              boxSizing: 'border-box',
              [below2xlMediaQuery]: {
                borderRadius: `${scaled(sideMenu.borderRadius)}px`,
              },
              '& .MuiListItem-root': {
                marginBottom: theme.spacing(0.5),
                [below2xlMediaQuery]: {
                  marginBottom: theme.spacing(0.75),
                },
              },
              '& .MuiListItemButton-root': {
                borderRadius: `${radius.md}px`,
                paddingTop: theme.spacing(1.5),
                paddingBottom: theme.spacing(1.5),
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(4),
                gap: theme.spacing(2),
                [below2xlMediaQuery]: {
                  borderRadius: `${scaled(radius.md)}px`,
                  paddingTop: theme.spacing(2.25),
                  paddingBottom: theme.spacing(2.25),
                  paddingLeft: theme.spacing(3),
                  paddingRight: theme.spacing(6),
                  gap: scaled(space[2]),
                },
              },
              '& .MuiListItemIcon-root': {
                minWidth: sideMenu.navIconSize,
                [below2xlMediaQuery]: {
                  minWidth: scaled(sideMenu.navIconSize),
                  '& svg': {
                    width: scaled(sideMenu.navIconSize),
                    height: scaled(sideMenu.navIconSize),
                  },
                },
              },
              '& .MuiListItemText-primary': {
                fontSize: font.h3.size,
                fontWeight: font.h3.weight,
                lineHeight: font.h3.lineHeight,
                whiteSpace: 'nowrap',
                [below2xlMediaQuery]: {
                  fontSize: scaled(font.h3.size),
                },
              },
            }
          },
        },
      ],
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => {
          const { sideMenu } = components
          const scaled = scaleBelow2xl

          return {
            '&[data-side-menu-toggle]': {
              paddingLeft: 0,
              paddingRight: 0,
              border: '1px solid',
              backgroundColor: theme.vars.palette.background.paper,
              transition: `left ${transition.normal}, top ${transition.normal}, width ${transition.normal}, height ${transition.normal}, border-radius ${transition.normal}`,
              '&:hover': {
                backgroundColor: theme.vars.palette.surfaceElevated.main,
              },
              '&[data-open="true"]': {
                width: sideMenu.toggleOpenSize,
                height: sideMenu.toggleOpenSize,
                minWidth: sideMenu.toggleOpenSize,
                borderRadius: `${radius.sm}px`,
                borderColor: theme.vars.palette.divider,
                '& svg': {
                  width: icon.sizeXs,
                  height: icon.sizeXs,
                },
              },
              '&[data-open="false"]': {
                width: sideMenu.toggleClosedSize,
                height: sideMenu.toggleClosedSize,
                minWidth: sideMenu.toggleClosedSize,
                borderRadius: `${radius.md}px`,
                borderColor: sideMenu.toggleClosedBorderColor,
                '& svg': {
                  width: icon.sizeXs,
                  height: icon.sizeXs,
                },
              },
              [below2xlMediaQuery]: {
                '&[data-open="true"]': {
                  width: scaled(sideMenu.toggleOpenSize),
                  height: scaled(sideMenu.toggleOpenSize),
                  minWidth: scaled(sideMenu.toggleOpenSize),
                  borderRadius: `${scaled(radius.sm)}px`,
                  '& svg': {
                    width: scaled(icon.sizeXs),
                    height: scaled(icon.sizeXs),
                  },
                },
                '&[data-open="false"]': {
                  width: scaled(sideMenu.toggleClosedSize),
                  height: scaled(sideMenu.toggleClosedSize),
                  minWidth: scaled(sideMenu.toggleClosedSize),
                  borderRadius: `${scaled(radius.md)}px`,
                  '& svg': {
                    width: scaled(icon.sizeXs),
                    height: scaled(icon.sizeXs),
                  },
                },
              },
            },
          }
        },
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
