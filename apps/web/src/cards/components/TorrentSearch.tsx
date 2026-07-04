import { Button, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { type ChangeEventHandler, type FC, type KeyboardEventHandler, useCallback, useState } from 'react'
import { useCommand } from '@repo/feed-client'

const TorrentSearchContainer = styled('div')({
  display: 'flex',
  marginBottom: '16px',
})

const Query = styled(TextField)({
  flex: '100% 1 1',
})

const Search = styled(Button)({
  margin: '0 2em',
  flex: '5em',
})

const TorrentSearch: FC = () => {
  const search = useCommand('torrents', 'search')
  const [query, setQuery] = useState<string>('')

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    e => {
      if (e.key === 'Enter') {
        search(query)
      }
    },
    [search, query],
  )

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>>(e => {
    setQuery(e.target.value)
  }, [])

  const onSearchClick = useCallback(() => {
    search(query)
  }, [query])

  return (
    <TorrentSearchContainer>
      <Query label='Search torrents' variant='outlined' value={query} onKeyDown={onKeyDown} onChange={onChange} />
      <Search onClick={onSearchClick}>Search</Search>
    </TorrentSearchContainer>
  )
}

export { TorrentSearch }
