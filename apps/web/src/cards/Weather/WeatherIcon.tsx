import { weatherIcons } from '@repo/assets'
import { styled } from '@mui/material/styles'
import { type CSSProperties, type FC } from 'react'

const iconTone = 'brightness(0.82) saturate(0.65)'

const colorWithAlpha = (color: string, alphaHex: string): string => {
  if (!color.startsWith('var(')) {
    return `${color}${alphaHex}`
  }

  const percent = Math.round((Number.parseInt(alphaHex, 16) / 255) * 100)

  return `color-mix(in srgb, ${color} ${percent}%, transparent)`
}

const glowByIntensity = (weather: string, intensity: 'soft' | 'default') => {
  if (intensity === 'soft') {
    return `drop-shadow(0 0 0.2em ${colorWithAlpha(weather, '33')}) drop-shadow(0 0 0.5em ${colorWithAlpha(weather, '14')})`
  }

  return `drop-shadow(0 0 0.3em ${colorWithAlpha(weather, '44')}) drop-shadow(0 0 0.75em ${colorWithAlpha(weather, '22')}) drop-shadow(0 0 1.2em ${colorWithAlpha(weather, '0d')})`
}

const WeatherIconRoot = styled('img')<{ $intensity: 'soft' | 'default' }>(({ theme, $intensity }) => ({
  display: 'inline-block',
  objectFit: 'contain',
  verticalAlign: 'middle',
  filter: `${iconTone} ${glowByIntensity(theme.vars.palette.weather.main, $intensity)}`,
}))

const mutedIconStyle: CSSProperties = {
  display: 'inline-block',
  objectFit: 'contain',
  verticalAlign: 'middle',
  filter: iconTone,
}

type WeatherIconProps = {
  icon: string
  glow?: 'soft' | 'default' | 'off'
  width?: string
  height?: string
  style?: CSSProperties
}

const WeatherIcon: FC<WeatherIconProps> = ({ icon, glow = 'off', width, height, style }) => {
  const src = weatherIcons[icon]
  if (!src) {
    return null
  }

  const sizeStyle: CSSProperties = { width, height, ...style }

  if (glow === 'off') {
    return <img src={src} alt='' style={{ ...mutedIconStyle, ...sizeStyle }} />
  }

  return <WeatherIconRoot src={src} alt='' $intensity={glow} style={sizeStyle} />
}

export default WeatherIcon
