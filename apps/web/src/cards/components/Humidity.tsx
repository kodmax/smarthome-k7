import { type FC } from 'react'
import { ColorIndicator } from './ColorIndication'
import { optimalHumidityRange } from '../../lib'
import { useFeed } from '@repo/feed-client'
import { KnxReadingType } from '@repo/types'

const Humidity: FC<{ label: string }> = ({ label }) => {
  const relativeHumidity = useFeed<KnxReadingType<number>>('home.air-quality.humidity')

  if (relativeHumidity === undefined) {
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
