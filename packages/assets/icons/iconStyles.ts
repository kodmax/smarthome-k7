import type { StyledIconOptions } from './createStyledIcon'

const paletteMain = (key: string) => `var(--mui-palette-${key}-main)`

export const iconStyles = {
  energy: { color: paletteMain('energy'), glow: 'default' },
  air: { color: paletteMain('air'), glow: 'default' },
  temperature: { color: paletteMain('temperature'), glow: 'default' },
  weather: { color: paletteMain('info'), glow: 'default' },
  media: { color: paletteMain('media'), glow: 'default' },
  warning: { color: paletteMain('warning'), glow: 'default' },
  neutral: { color: 'var(--mui-palette-text-primary)', glow: 'soft' },
  muted: { color: 'var(--mui-palette-text-secondary)', glow: 'soft' },
  link: { color: paletteMain('primary'), glow: 'off' },
} as const satisfies Record<string, StyledIconOptions>
