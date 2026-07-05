import type { LucideIcon, LucideProps } from 'lucide-react'
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { type IconGlow, iconGlowFilter } from './iconGlow'

export type StyledIconOptions = {
  color: string
}

export type StyledIconProps = LucideProps & {
  glow?: IconGlow
}

export type StyledLucideIcon = ForwardRefExoticComponent<StyledIconProps & RefAttributes<SVGSVGElement>>

export function createStyledIcon(source: LucideIcon, { color }: StyledIconOptions): StyledLucideIcon {
  const SourceIcon = source

  const StyledIcon = forwardRef<SVGSVGElement, StyledIconProps>(function StyledLucideIcon(
    { color: colorOverride, style, glow = 'off', ...props },
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

  return StyledIcon as StyledLucideIcon
}
