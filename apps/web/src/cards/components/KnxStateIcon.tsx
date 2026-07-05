import { type SvgIconComponent } from '@mui/icons-material'
import { useFeed } from '@repo/feed-client'

type KnxStateIconProps<T> = {
  id: string
  active?: (payload: T) => boolean
  visible?: (payload: T) => boolean
  icon: (payload: T) => SvgIconComponent
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
      sx={{
        paddingRight: '0.1em',
        width: '12px',
        height: '12px',
        color: isActive ? 'temperature.main' : 'text.disabled',
        fontSize: 'inherit',
        visibility: visible(reading) ? 'visible' : 'hidden',
        opacity: opacity(reading),
      }}
    />
  )
}

export default KnxStateIcon
