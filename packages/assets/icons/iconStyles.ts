import type { StyledIconOptions } from './createStyledIcon'

const paletteMain = (key: string) => `var(--mui-palette-${key}-main)`

export const iconStyles = {
  energy: { color: paletteMain('energy') },
  air: { color: paletteMain('air') },
  temperature: { color: paletteMain('temperature') },
  weather: { color: paletteMain('info') },
  error: { color: paletteMain('error') },
  media: { color: paletteMain('media') },
  warning: { color: paletteMain('warning') },
  neutral: { color: 'var(--mui-palette-text-primary)' },
  muted: { color: 'var(--mui-palette-text-secondary)' },
  link: { color: paletteMain('primary') },
  fav: { color: '#EAB308' },
} as const satisfies Record<string, StyledIconOptions>
