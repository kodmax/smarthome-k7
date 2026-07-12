import { IconButton, InputAdornment, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { designTokens } from '@repo/design-tokens'
import { X } from 'lucide-react'
import { type ChangeEventHandler, type FC, type KeyboardEventHandler, useCallback } from 'react'
import { useTranslations } from '@/i18n'

const Query = styled(TextField)({
  flex: '100% 1 1',
})

const iconSize = designTokens.icon.sizeXs - 4

type TorrentSearchQueryProps = {
  query: string
  onQuery: (query: string) => void
  onSearch: () => void
  onClear: () => void
}

export const TorrentSearchQuery: FC<TorrentSearchQueryProps> = ({ query, onQuery, onSearch, onClear }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.torrents

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    e => {
      if (e.key === 'Enter') {
        onSearch()
      }
    },
    [onSearch],
  )

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>(
    e => {
      onQuery(e.target.value)
    },
    [onQuery],
  )

  return (
    <Query
      label={labels.searchTorrents}
      variant='outlined'
      value={query}
      onKeyDown={onKeyDown}
      onChange={onChange}
      slotProps={{
        input: {
          endAdornment:
            query !== '' ? (
              <InputAdornment position='end'>
                <IconButton aria-label={labels.clearSearch} onClick={onClear} size='small' edge='end'>
                  <X size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
                </IconButton>
              </InputAdornment>
            ) : null,
        },
      }}
    />
  )
}
