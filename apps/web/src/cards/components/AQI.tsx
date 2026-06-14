import { type FC } from 'react'
import { useFeed } from '@repo/feed-client'
import { ColorIndicator } from './ColorIndication'
import { WeatherFeed } from '@repo/types'

const AQI: FC<{ label: string }> = ({ label }) => {
  const feed = useFeed<WeatherFeed>('weather')

  if (feed) {
    return (
      <tr>
        <td>{label}</td>
        <td></td>
        <td></td>
        <td>
          <ColorIndicator instant={feed.aq.aqi} range={{ optimal: 0, highest: 150 }} />
          {feed.aq.aqi} AQI
        </td>
      </tr>
    )
  } else {
    return (
      <tr>
        <td>{label}</td>
        <td></td>
        <td></td>
        <td style={{ color: 'silver' }}>--</td>
      </tr>
    )
  }
}

export default AQI
