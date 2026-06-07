import { type FC } from 'react'
import { useUpdate } from '@repo/feed-client'
import { ColorIndicator } from './ColorIndication'
import { WeatherData } from '@repo/types'

const AQI: FC<{ label: string }> = ({ label }) => {
  const [reading] = useUpdate<WeatherData>('weather')

  if (reading) {
    return (
      <tr>
        <td>{label}</td>
        <td></td>
        <td></td>
        <td>
          <ColorIndicator instant={reading.aq.aqi} range={{ optimal: 0, higest: 150 }} />
          {reading.aq.aqi} AQI
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
