import { iconGlowFilter } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { FC, useId } from 'react'
import { Star } from 'lucide-react'

export type SkillStarGradientStop = {
  offset: string
  color: string
}

type Props = {
  size: number
  gradientStops: readonly SkillStarGradientStop[]
  glowColor: string
}

export const GradientSkillStarIcon: FC<Props> = ({ size, gradientStops, glowColor }) => {
  const gradientId = useId().replace(/:/g, '')
  const fill = `url(#${gradientId})`

  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        flexShrink: 0,
        filter: iconGlowFilter(glowColor, 'default'),
      }}
    >
      <svg width={0} height={0} aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='35%' y2='100%'>
            {gradientStops.map(stop => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
      </svg>
      <Star size={size} strokeWidth={designTokens.icon.strokeWidth} fill={fill} color={fill} stroke={fill} />
    </span>
  )
}
