import { type FC } from 'react'
import { useFeed } from '@repo/feed-client'
import { Graph } from './Graph'
import { WeatherFeed } from '@repo/types'

const Pressure: FC = () => {
  const feed = useFeed<WeatherFeed>('weather')

  if (feed === undefined) {
    return (
      <tr>
        <td>Zmiany ciśnienia</td>
        <td></td>
        <td style={{ color: 'silver' }}>--</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>Ciśnienie</td>
      <td style={{ padding: 0 }}>
        <Graph
          data={feed.pressure.week.map(({ pressure, datetime }) => ({
            value: pressure,
            datetime,
          }))}
          scaleX={14}
          scaleY={25}
        />
      </td>
      <td>{Number(feed.pressure.instant).toFixed(0)} hPa</td>
    </tr>
  )
}

export default Pressure
