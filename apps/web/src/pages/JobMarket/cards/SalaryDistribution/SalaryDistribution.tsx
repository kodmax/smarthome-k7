import { Box, Typography } from '@mui/material'
import { PowerIcon } from '@repo/assets'
import { BaseCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { JobMarketInsightFeed } from '@repo/types'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { salaryDistributionAxisTicks, salaryDistributionChartMaxPercent } from './salaryDistributionConfig'

const labelWidth = 108
const valueWidth = 40
const chartHeight = 18
const rowGap = 2.5

export const SalaryDistribution: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const labels = t.jobMarket.salaryDistribution
  const feed = useFeed<JobMarketInsightFeed>('job-market-insight')
  const brackets = feed?.salaryDistribution ?? []

  return (
    <BaseCard
      cardId='job-market-salary-distribution'
      title={labels.title}
      icon={PowerIcon}
      extraHeight={2}
      height={7}
      allowZoom={false}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: rowGap }}>
        {brackets.map(bracket => (
          <Box key={bracket.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant='body1'
              sx={{ width: labelWidth, flexShrink: 0, color: 'text.secondary', whiteSpace: 'nowrap' }}
            >
              {labels.brackets[bracket.id]}
            </Typography>

            <Box sx={{ position: 'relative', flex: 1, height: chartHeight }}>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  pointerEvents: 'none',
                }}
              >
                {[1, 2, 3, 4].map(line => (
                  <Box
                    key={line}
                    sx={{
                      borderLeft: '1px solid',
                      borderColor: 'divider',
                      height: '100%',
                    }}
                  />
                ))}
              </Box>

              <Box
                sx={theme => {
                  const barColor = theme.vars.palette.energy.main
                  const barTipColor = `color-mix(in srgb, ${barColor} 45%, ${theme.vars.palette.background.paper})`
                  const fadeWidth = 84

                  return {
                    position: 'relative',
                    height: '100%',
                    width: `${(bracket.percentage / salaryDistributionChartMaxPercent) * 100}%`,
                    maxWidth: '100%',
                    borderRadius: chartHeight / 2,
                    background: `linear-gradient(90deg, ${barColor} 0, ${barColor} calc(100% - ${fadeWidth}px), ${barTipColor} 100%)`,
                  }
                }}
              />
            </Box>

            <Typography variant='body2' sx={{ width: valueWidth, flexShrink: 0, textAlign: 'right', fontWeight: 600 }}>
              {bracket.percentage}%
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
        <Box sx={{ width: labelWidth, flexShrink: 0 }} />
        <Box sx={{ position: 'relative', flex: 1, height: 16 }}>
          {salaryDistributionAxisTicks.map(tick => (
            <Typography
              key={tick}
              variant='caption'
              sx={{
                position: 'absolute',
                left: `${(tick / salaryDistributionChartMaxPercent) * 100}%`,
                transform:
                  tick === 0
                    ? undefined
                    : tick === salaryDistributionChartMaxPercent
                      ? 'translateX(-100%)'
                      : 'translateX(-50%)',
                color: 'text.secondary',
              }}
            >
              {tick}%
            </Typography>
          ))}
        </Box>
        <Box sx={{ width: valueWidth, flexShrink: 0 }} />
      </Box>
    </BaseCard>
  )
}
