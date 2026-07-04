import { type FC } from 'react'
import { useFeed } from '@repo/feed-client'
import { ColorIndicator } from './ColorIndication'
import { ApolloTableCell, ApolloTableRow } from './ApolloDataTable'
import ValuePlaceholder from './ValuePlaceholder'
import { WeatherFeed } from '@repo/types'

const AQI: FC<{ label: string }> = ({ label }) => {
  const feed = useFeed<WeatherFeed>('weather')

  if (feed) {
    return (
      <ApolloTableRow>
        <ApolloTableCell>{label}</ApolloTableCell>
        <ApolloTableCell />
        <ApolloTableCell />
        <ApolloTableCell>
          <ColorIndicator instant={feed.aq.aqi} range={{ optimal: 0, highest: 150 }} />
          {feed.aq.aqi} AQI
        </ApolloTableCell>
      </ApolloTableRow>
    )
  }

  return <ValuePlaceholder label={label} />
}

export default AQI
