import { type FC } from 'react'
import { StockMarketIcon } from '@repo/assets'
import { useFeed } from '@repo/feed-client'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { StockMarketFeed } from '@repo/types'
import { Ticker } from './Ticker'
import { TableBody, TableHead, TableRow } from '@mui/material'
import { useSortedTickers } from './useSortedTickers'
import { useMarketSession } from './useMarketSession'
import { marketStatusTitles } from './consts'

const cardTableFontSize = designTokens.font.body.size
const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px` } }

export const StockMarket: FC<Record<string, never>> = () => {
  const zoom = useZoom('stock-market')
  const feed = useFeed<StockMarketFeed>('stock-market')
  const tickers = useSortedTickers(feed)
  const marketSession = useMarketSession(feed?.marketInfo)

  if (feed === undefined || tickers === undefined || marketSession === undefined) {
    return (
      <ApolloCard cardId='stock-market' title='Giełda' icon={StockMarketIcon} height={9}>
        <TablePlaceholder rows={12} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const headingInfo = `${marketStatusTitles[marketSession.status]} · ${marketSession.countdown}`

  return (
    <ApolloCard cardId='stock-market' title='Giełda' icon={StockMarketIcon} height={9} headingInfo={headingInfo}>
      <ApolloDataTable style={{ fontSize: cardTableFontSize, lineHeight: zoom ? 1.2 : undefined }}>
        {zoom ? (
          <TableHead>
            <TableRow sx={headerRowSx}>
              <ApolloTableCell sx={{ width: '1em' }} />
              <ApolloTableCell>Symbol</ApolloTableCell>
              <ApolloTableCell>Do wyników</ApolloTableCell>
              <ApolloTableCell>Do celu</ApolloTableCell>
              <ApolloTableCell>C/Z@Cel</ApolloTableCell>
              <ApolloTableCell>Notowanie</ApolloTableCell>
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tickers.map(item => (
            <Ticker key={item.symbol} ticker={item} zoom={zoom} />
          ))}
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}
