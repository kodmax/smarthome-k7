import { type FC } from 'react'
import { useUpdate } from '@repo/feed-client'
import { ColorIndicator } from './ColorIndication'

type AirQualityIndex = {
  aqi: number
}

const AQI: FC<{ label: string; onUpdate: (ts: number) => void }> = ({ label }) => {
  const [reading] = useUpdate<{ aq: AirQualityIndex }>('weather')

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
