export type IconGlow = 'default' | 'soft' | 'off'

const colorWithAlpha = (color: string, alphaHex: string): string => {
  if (!color.startsWith('var(')) {
    return `${color}${alphaHex}`
  }

  const percent = Math.round((Number.parseInt(alphaHex, 16) / 255) * 100)

  return `color-mix(in srgb, ${color} ${percent}%, transparent)`
}

export function iconGlowFilter(color: string, glow: Exclude<IconGlow, 'off'>): string {
  if (glow === 'soft') {
    return `drop-shadow(0 0 0.25em ${colorWithAlpha(color, '66')}) drop-shadow(0 0 0.6em ${colorWithAlpha(color, '2e')})`
  }

  return `drop-shadow(0 0 0.35em ${colorWithAlpha(color, '8c')}) drop-shadow(0 0 0.9em ${colorWithAlpha(color, '47')}) drop-shadow(0 0 1.4em ${colorWithAlpha(color, '1f')})`
}
