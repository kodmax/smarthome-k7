import { type FC } from 'react'
import { useFeed } from '@repo/feed-client'
import { WeatherFeed } from '@repo/types'
import { Reading } from './Reading'

const AQI: FC<{ label: string }> = ({ label }) => {
  const feed = useFeed<WeatherFeed>('weather')

  return (
    <Reading
      title={label}
      displayValue={feed !== undefined ? String(feed.aq.aqi) : undefined}
      colorIndicatorRange={{ optimal: 0, highest: 150 }}
      value={feed?.aq.aqi}
      unit='AQI'
    />
  )
}

export default AQI
