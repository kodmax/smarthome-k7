import { useFeed } from '@repo/feed-client'
import { designTokens } from '@repo/design-tokens'
import type { LucideIcon } from 'lucide-react'

type KnxStateIconProps<T> = {
  id: string
  active?: (payload: T) => boolean
  visible?: (payload: T) => boolean
  icon: (payload: T) => LucideIcon
  opacity?: (payload: T) => number
}

const KnxStateIcon = <T,>({
  id,
  active = () => false,
  icon,
  opacity = () => 1,
  visible = () => true,
}: KnxStateIconProps<T>) => {
  const reading = useFeed<T>(id)

  if (reading === undefined) {
    return null
  }

  const isActive = active(reading)
  const Icon = icon(reading)

  return (
    <Icon
      size={12}
      strokeWidth={designTokens.icon.strokeWidth}
      color={isActive ? 'var(--mui-palette-temperature-main)' : 'var(--mui-palette-text-disabled)'}
      style={{
        paddingRight: `${designTokens.space[1] / 2}px`,
        visibility: visible(reading) ? 'visible' : 'hidden',
        opacity: opacity(reading),
      }}
    />
  )
}

export default KnxStateIcon
