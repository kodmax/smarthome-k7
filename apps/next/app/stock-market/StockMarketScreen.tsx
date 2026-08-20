'use client'

import { iconStyles, StockMarketIcon } from '@repo/assets'
import { type FC } from 'react'
import { PageHeader } from '@/app/shell/components/PageHeader'
import { PageWrapper } from '@/app/shell/components/PageWrapper'

type StockMarketScreenProps = {
  title: string
  description: string
}

export const StockMarketScreen: FC<StockMarketScreenProps> = ({ title, description }) => (
  <PageWrapper>
    <PageHeader title={title} description={description} icon={StockMarketIcon} iconColor={iconStyles.energy.color} />
  </PageWrapper>
)
