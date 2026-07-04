export type IconGlow = 'default' | 'soft' | 'off'

export function iconGlowFilter(color: string, glow: Exclude<IconGlow, 'off'>): string {
  if (glow === 'soft') {
    return `drop-shadow(0 0 0.25em ${color}66) drop-shadow(0 0 0.6em ${color}2e)`
  }

  return `drop-shadow(0 0 0.35em ${color}8c) drop-shadow(0 0 0.9em ${color}47) drop-shadow(0 0 1.4em ${color}1f)`
}
