import { Button } from '@mui/material'
import { styled } from '@mui/system'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { TorrentSearchQuery } from './TorrentSearchQuery'

const TorrentSearchContainer = styled('div')({
  display: 'flex',
  marginBottom: '16px',
})

const Search = styled(Button)({
  margin: '0 2em',
  flex: '7em',
})

type TorrentSearchProps = {
  query: string
  onQuery: (query: string) => void
  onSearch: () => void
  onClear: () => void
}

const TorrentSearch: FC<TorrentSearchProps> = ({ query, onQuery, onSearch, onClear }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.torrents

  return (
    <TorrentSearchContainer>
      <TorrentSearchQuery query={query} onQuery={onQuery} onSearch={onSearch} onClear={onClear} />
      <Search onClick={onSearch}>{query !== '' ? labels.search : labels.showAll}</Search>
    </TorrentSearchContainer>
  )
}

export { TorrentSearch }
