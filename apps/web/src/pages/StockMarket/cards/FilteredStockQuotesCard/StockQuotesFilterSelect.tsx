import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { STOCK_QUOTES_FILTER_ORDER, type StockQuotesFilter } from './stockQuotesFilter'

type Props = {
  value: StockQuotesFilter
  onChange: (filter: StockQuotesFilter) => void
}

export const StockQuotesFilterSelect: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslations()
  const labels = t.stockMarket.filters

  const handleChange = (event: SelectChangeEvent<StockQuotesFilter>) => {
    onChange(event.target.value as StockQuotesFilter)
  }

  const filterLabels: Record<StockQuotesFilter, string> = {
    'high-upside': t.stockMarket.highUpside.title,
    'low-forward-pe': t.stockMarket.lowForwardPE.title,
    'earnings-soon': t.stockMarket.earningsSoon.title,
  }

  return (
    <FormControl size='small' sx={{ minWidth: 220 }}>
      <Select value={value} onChange={handleChange} aria-label={labels.label}>
        {STOCK_QUOTES_FILTER_ORDER.map(filter => (
          <MenuItem key={filter} value={filter}>
            {filterLabels[filter]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
