import { type FC, type ReactNode } from 'react'
import { type StyledLucideIcon } from '@repo/assets'
import { BaseCard } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, TablePlaceholder } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { TickerData } from '@repo/types'
import { useTranslations } from '@/i18n'
import { Ticker } from '@/pages/Dashboard/cards/stock-market/Ticker'
import { TableBody, TableHead, TableRow } from '@mui/material'

const cardTableFontSize = designTokens.font.body.size
const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px` } }

type StockQuotesProps = {
  tickers: TickerData[] | undefined
  title: string
  icon: StyledLucideIcon
  cardId?: string
  height?: number
  headingInfo?: ReactNode
}

export const StockQuotes: FC<StockQuotesProps> = ({
  tickers,
  title,
  icon: Icon,
  cardId = 'stock-quotes',
  height = 24,
  headingInfo,
}) => {
  const { t } = useTranslations()
  const labels = t.dashboard.stockMarket

  if (tickers === undefined) {
    return (
      <BaseCard cardId={cardId} title={title} icon={Icon} height={height} allowZoom={false} headingInfo={headingInfo}>
        <TablePlaceholder rows={12} graph={false} value={true} />
      </BaseCard>
    )
  }

  return (
    <BaseCard cardId={cardId} title={title} icon={Icon} height={height} allowZoom={false} headingInfo={headingInfo}>
      <ApolloDataTable style={{ fontSize: cardTableFontSize, lineHeight: 2 }}>
        <TableHead>
          <TableRow sx={headerRowSx}>
            <ApolloTableCell sx={{ width: '14px' }} />
            <ApolloTableCell>{labels.symbol}</ApolloTableCell>
            <ApolloTableCell>{labels.earnings}</ApolloTableCell>
            <ApolloTableCell>{labels.pe}</ApolloTableCell>
            <ApolloTableCell>{labels.toPriceTarget}</ApolloTableCell>
            <ApolloTableCell>{labels.priceTarget}</ApolloTableCell>
            <ApolloTableCell>{labels.peAtTarget}</ApolloTableCell>
            <ApolloTableCell>{labels.quote}</ApolloTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickers.map(item => (
            <Ticker key={item.symbol} ticker={item} zoom={true} />
          ))}
        </TableBody>
      </ApolloDataTable>
    </BaseCard>
  )
}
