import { type FC } from 'react'
import { useFeed } from '@repo/feed-client'
import { ApolloTableCell, ApolloTableRow, ApolloValueCell } from './ApolloDataTable'
import { Graph } from './Graph'
import ValuePlaceholder from './ValuePlaceholder'
import { WeatherFeed } from '@repo/types'

const Pressure: FC = () => {
  const feed = useFeed<WeatherFeed>('weather')

  if (feed === undefined) {
    return <ValuePlaceholder label='Zmiany ciśnienia' />
  }

  return (
    <ApolloTableRow>
      <ApolloTableCell>Ciśnienie</ApolloTableCell>
      <ApolloTableCell sx={{ padding: 0 }}>
        <Graph
          data={feed.pressure.week.map(({ pressure, datetime }) => ({
            value: pressure,
            datetime,
          }))}
          scaleX={14}
          scaleY={25}
        />
      </ApolloTableCell>
      <ApolloTableCell />
      <ApolloValueCell>{Number(feed.pressure.instant).toFixed(0)} hPa</ApolloValueCell>
    </ApolloTableRow>
  )
}

export default Pressure
