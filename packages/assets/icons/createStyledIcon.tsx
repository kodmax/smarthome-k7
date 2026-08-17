import type { LucideIcon, LucideProps } from 'lucide-react'
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { type IconGlow, iconGlowFilter } from './iconGlow'
import './iconSpin.css'

export type StyledIconOptions = {
  color: string
  glowColor?: string
}

export type StyledIconProps = LucideProps & {
  glow?: IconGlow
  spinning?: boolean
}

export type StyledLucideIcon = ForwardRefExoticComponent<StyledIconProps & RefAttributes<SVGSVGElement>>

export function createStyledIcon(
  source: LucideIcon,
  { color, glowColor = color }: StyledIconOptions,
): StyledLucideIcon {
  const SourceIcon = source

  const StyledIcon = forwardRef<SVGSVGElement, StyledIconProps>(function StyledLucideIcon(
    { color: colorOverride, style, glow = 'off', spinning = false, ...props },
    ref,
  ) {
    const iconColor = colorOverride ?? color
    const effectiveGlowColor = colorOverride !== undefined ? iconColor : glowColor
    const glowFilter = glow === 'off' ? undefined : iconGlowFilter(effectiveGlowColor, glow)
    const spinStyle = spinning ? { animation: 'repo-icon-spin 1s linear infinite' } : undefined

    return (
      <SourceIcon
        ref={ref}
        color={iconColor}
        style={glowFilter ? { ...style, ...spinStyle, filter: glowFilter } : { ...style, ...spinStyle }}
        {...props}
      />
    )
  })

  StyledIcon.displayName = `Styled${source.displayName ?? source.name ?? 'Icon'}`

  return StyledIcon as StyledLucideIcon
}
