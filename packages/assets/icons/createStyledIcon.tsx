import type { LucideIcon, LucideProps } from 'lucide-react'
import { forwardRef } from 'react'
import { type IconGlow, iconGlowFilter } from './iconGlow'

export type StyledIconOptions = {
  color: string
  glow?: IconGlow
}

export function createStyledIcon(source: LucideIcon, { color, glow = 'default' }: StyledIconOptions): LucideIcon {
  const SourceIcon = source

  const StyledIcon = forwardRef<SVGSVGElement, LucideProps>(function StyledLucideIcon(
    { color: colorOverride, style, ...props },
    ref,
  ) {
    const iconColor = colorOverride ?? color
    const glowFilter = glow === 'off' ? undefined : iconGlowFilter(iconColor, glow)

    return (
      <SourceIcon
        ref={ref}
        color={iconColor}
        style={glowFilter ? { ...style, filter: glowFilter } : style}
        {...props}
      />
    )
  })

  StyledIcon.displayName = `Styled${source.displayName ?? source.name ?? 'Icon'}`

  return StyledIcon as LucideIcon
}
