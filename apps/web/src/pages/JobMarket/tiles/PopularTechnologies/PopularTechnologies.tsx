import { Box, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { ListIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { ApolloDataTable, ApolloTableCell, ApolloValueCell } from '@/card-components'
import { useTranslations } from '@/i18n'
import { popularTechnologies } from './popularTechnologiesData'

const tableHeaderGap = designTokens.space[3]
const headerRowSx = { '& .MuiTableCell-root': { pb: `${tableHeaderGap}px`, color: 'text.secondary' } }

export const PopularTechnologies: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.popularTechnologies

  return (
    <ApolloCard
      cardId='job-market-popular-technologies'
      title={labels.title}
      icon={ListIcon}
      height={16}
      allowZoom={false}
    >
      <ApolloDataTable sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={headerRowSx}>
            <ApolloTableCell sx={{ width: 32 }}>{labels.columns.rank}</ApolloTableCell>
            <ApolloTableCell>{labels.columns.technology}</ApolloTableCell>
            <ApolloValueCell sx={{ width: 72 }}>{labels.columns.offers}</ApolloValueCell>
            <ApolloValueCell sx={{ width: 72 }}>{labels.columns.share}</ApolloValueCell>
            <ApolloValueCell sx={{ width: 96 }}>{labels.columns.median}</ApolloValueCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {popularTechnologies.map(technology => (
            <TableRow key={technology.id} sx={{ height: 40 }}>
              <ApolloTableCell>{technology.rank}</ApolloTableCell>
              <ApolloTableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: `${designTokens.radius.sm}px`,
                      bgcolor: technology.color,
                      color: technology.id === 'javascript' ? 'text.primary' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {technology.abbreviation}
                  </Box>
                  <Typography variant='body2' noWrap>
                    {technology.name}
                  </Typography>
                </Box>
              </ApolloTableCell>
              <ApolloValueCell>{technology.offers}</ApolloValueCell>
              <ApolloValueCell>{technology.share}</ApolloValueCell>
              <ApolloValueCell>{technology.median}</ApolloValueCell>
            </TableRow>
          ))}
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}
