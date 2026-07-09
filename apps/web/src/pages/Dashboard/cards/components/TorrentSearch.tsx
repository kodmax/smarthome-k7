import { Button } from '@mui/material'
import { styled } from '@mui/system'
import { type FC } from 'react'
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
  return (
    <TorrentSearchContainer>
      <TorrentSearchQuery query={query} onQuery={onQuery} onSearch={onSearch} onClear={onClear} />
      <Search onClick={onSearch}>{query !== '' ? 'Search' : 'Show all'}</Search>
    </TorrentSearchContainer>
  )
}

export { TorrentSearch }
