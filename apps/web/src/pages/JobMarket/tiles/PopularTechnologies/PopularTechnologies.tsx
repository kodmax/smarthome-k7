import { Box, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { ListIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { designTokens } from '@repo/design-tokens'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { ApolloDataTable, ApolloTableCell, ApolloValueCell, TablePlaceholder } from '@/card-components'
import { formatNumber } from '@/helpers/formatNumber'
import { useTranslations } from '@/i18n'
import { TechnologyLogo } from './TechnologyLogo'

const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px`, color: 'text.secondary' } }

export const PopularTechnologies: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.popularTechnologies
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')

  return (
    <ApolloCard
      cardId='job-market-popular-technologies'
      title={labels.title}
      icon={ListIcon}
      height={24}
      allowZoom={false}
    >
      {feed === undefined ? (
        <TablePlaceholder rows={50} graph={false} value={true} />
      ) : (
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <ApolloDataTable sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={headerRowSx}>
                <ApolloTableCell sx={{ width: 24 }}>{labels.columns.rank}</ApolloTableCell>
                <ApolloTableCell>{labels.columns.technology}</ApolloTableCell>
                <ApolloValueCell sx={{ width: 48 }}>{labels.columns.offers}</ApolloValueCell>
                <ApolloValueCell sx={{ width: 48 }}>{labels.columns.share}</ApolloValueCell>
                <ApolloValueCell sx={{ width: 80 }}>{labels.columns.median}</ApolloValueCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {feed.popularTechnologies.map((technology, index) => (
                <TableRow key={technology.id} sx={{ height: 40 }}>
                  <ApolloTableCell>{index + 1}</ApolloTableCell>
                  <ApolloTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <TechnologyLogo id={technology.id} name={technology.name} />
                      <Typography variant='body2' noWrap>
                        {technology.name}
                      </Typography>
                    </Box>
                  </ApolloTableCell>
                  <ApolloValueCell>{formatNumber(technology.offersCount, { fractionDigits: 0 })}</ApolloValueCell>
                  <ApolloValueCell>{`${technology.sharePercent}%`}</ApolloValueCell>
                  <ApolloValueCell>
                    {technology.medianSalary !== null
                      ? `${formatNumber(technology.medianSalary, { fractionDigits: 0 })} zł`
                      : '--'}
                  </ApolloValueCell>
                </TableRow>
              ))}
            </TableBody>
          </ApolloDataTable>
        </Box>
      )}
    </ApolloCard>
  )
}
