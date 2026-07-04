import { weatherIcons } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { styled } from '@mui/material/styles'
import { type CSSProperties, type FC } from 'react'

const weather = designTokens.color.weather

const iconTone = 'brightness(0.82) saturate(0.65)'

const glowByIntensity = {
  soft: `drop-shadow(0 0 0.2em ${weather}33) drop-shadow(0 0 0.5em ${weather}14)`,
  default: `drop-shadow(0 0 0.3em ${weather}44) drop-shadow(0 0 0.75em ${weather}22) drop-shadow(0 0 1.2em ${weather}0d)`,
} as const

const WeatherIconRoot = styled('img')<{ $intensity: 'soft' | 'default' }>(({ $intensity }) => ({
  display: 'inline-block',
  objectFit: 'contain',
  verticalAlign: 'middle',
  filter: `${iconTone} ${glowByIntensity[$intensity]}`,
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

const WeatherIcon: FC<WeatherIconProps> = ({ icon, glow = 'default', width, height, style }) => {
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
