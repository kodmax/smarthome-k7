import { IconButton, InputAdornment, TextField } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { X } from 'lucide-react'
import { FC, type ChangeEvent, type MouseEvent } from 'react'
import { useTranslations } from '@/i18n'

const clearIconSize = designTokens.icon.sizeXs - 4

type Props = {
  value: string
  onChange: (value: string) => void
}

export const TechnologySearchInput: FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslations()
  const labels = t.jobMarket.popularTechnologies

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const handleClearMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <TextField
      value={value}
      onChange={handleChange}
      size='small'
      placeholder={labels.searchPlaceholder}
      slotProps={{
        htmlInput: {
          'aria-label': labels.searchLabel,
        },
        input: {
          endAdornment:
            value !== '' ? (
              <InputAdornment position='end'>
                <IconButton
                  aria-label={labels.clearSearch}
                  onMouseDown={handleClearMouseDown}
                  onClick={() => onChange('')}
                  size='small'
                  edge='end'
                >
                  <X size={clearIconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
                </IconButton>
              </InputAdornment>
            ) : null,
        },
      }}
      sx={{
        width: 96,
        minWidth: 96,
        maxWidth: 96,
        flex: '0 0 96px',
        '& .MuiOutlinedInput-root': {
          height: 28,
          fontSize: designTokens.font.body.size,
        },
        '& .MuiOutlinedInput-input': {
          py: 0,
        },
        '& .MuiOutlinedInput-notchedOutline legend': {
          maxWidth: '100%',
        },
      }}
    />
  )
}
