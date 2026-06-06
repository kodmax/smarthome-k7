import { type FC, useEffect } from 'react'
import { useUpdate } from '@repo/feed-client'
import { Graph } from './Graph'
import { WeatherData } from '@repo/types'

const Pressure: FC<{ onUpdate: (ts: number) => void }> = ({ onUpdate }) => {
  const [recent, updatedAt] = useUpdate<WeatherData>('weather')

  useEffect(() => {
    onUpdate(new Date().getTime())
  }, [updatedAt])

  if (recent) {
    return (
      <tr>
        <td>Ciśnienie</td>
        <td style={{ padding: 0 }}>
          <Graph
            data={recent.pressure.week.map(({ pressure, datetime }) => ({
              value: pressure,
              datetime,
            }))}
            scaleX={14}
            scaleY={25}
          />
        </td>
        <td></td>
        <td>{Number(recent.pressure.instant).toFixed(0)} hPa</td>
      </tr>
    )
  } else {
    return (
      <tr>
        <td>Zmiany ciśnienia</td>
        <td></td>
        <td></td>
        <td style={{ color: 'silver' }}>--</td>
      </tr>
    )
  }
}

export default Pressure
