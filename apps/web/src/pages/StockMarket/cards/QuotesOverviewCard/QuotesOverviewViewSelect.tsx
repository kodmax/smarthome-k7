import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { QUOTES_OVERVIEW_VIEW_ORDER, type QuotesOverviewView } from './quotesOverviewViews'

type Props = {
  value: QuotesOverviewView
  onChange: (view: QuotesOverviewView) => void
}

export const QuotesOverviewViewSelect: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslations()
  const labels = t.stockMarket.views

  const handleChange = (event: SelectChangeEvent<QuotesOverviewView>) => {
    onChange(event.target.value as QuotesOverviewView)
  }

  const viewLabels: Record<QuotesOverviewView, string> = {
    'high-upside': t.stockMarket.highUpside.title,
    'low-forward-pe': t.stockMarket.lowForwardPE.title,
    'earnings-soon': t.stockMarket.earningsSoon.title,
    'price-target-change': t.stockMarket.priceTargetChange.title,
  }

  return (
    <FormControl size='small' sx={{ minWidth: 220 }}>
      <Select value={value} onChange={handleChange} aria-label={labels.label}>
        {QUOTES_OVERVIEW_VIEW_ORDER.map(view => (
          <MenuItem key={view} value={view}>
            {viewLabels[view]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
