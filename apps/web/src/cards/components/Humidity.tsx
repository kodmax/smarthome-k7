import { type FC } from 'react'
import { ColorIndicator } from './ColorIndication'
import { optimalHumidityRange } from '../../lib'
import { useFeed } from '@repo/feed-client'
import { KnxReading } from 'js-knx'

const Humidity: FC<{ label: string }> = ({ label }) => {
  const relativeHumidity = useFeed<KnxReading<number>>('home.air-quality.humidity')
  const temp = useFeed<KnxReading<number>>('home.temp.bedroom')

  if (relativeHumidity === undefined || temp === undefined) {
    return (
      <tr>
        <td>{label}</td>
        <td></td>
        <td></td>
        <td>--</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{label}</td>
      <td></td>
      <td></td>
      <td>
        <ColorIndicator instant={relativeHumidity.value} range={optimalHumidityRange} />
        {relativeHumidity.value.toFixed(0)}%
      </td>
    </tr>
  )
}

export default Humidity
