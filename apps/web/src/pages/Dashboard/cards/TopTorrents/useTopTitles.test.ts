import { Torrent } from '@repo/types'
import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTopTitles } from './useTopTitles'

const torrent = (name: string, index = 0, imdb: string | null = 'tt0000000'): Torrent => ({
  added: '0',
  category: 'movies',
  id: String(index),
  imdb,
  info_hash: `hash-${index}`,
  leechers: '0',
  name,
  num_files: '1',
  seeders: '1',
  size: '1000000000',
  status: 'vip',
  username: 'user',
})

describe('useTopTitles', () => {
  it('returns undefined when torrents are undefined', () => {
    const { result } = renderHook(() => useTopTitles(undefined, ''))

    expect(result.current).toBeUndefined()
  })

  it('returns unique titles from torrent list', () => {
    const torrents = [
      torrent('Toy.Story.5.2026.1080p.DCPRIP', 0, 'tt1111111'),
      torrent('Toy.Story.5.2026.1080p.CAM.x264', 1, 'tt2222222'),
      torrent('Michael (2026) [1080p]', 2, 'tt3333333'),
    ]

    const { result } = renderHook(() => useTopTitles(torrents, ''))

    expect(result.current).toEqual([
      { title: 'Toy Story 5 (2026)', imdb: 'tt1111111' },
      { title: 'Michael (2026)', imdb: 'tt3333333' },
    ])
  })

  it('keeps cached titles while lastQuery is not empty', () => {
    const initialTorrents = [
      torrent('Toy.Story.5.2026.1080p.DCPRIP', 0, 'tt1111111'),
      torrent('Michael (2026) [1080p]', 1, 'tt3333333'),
    ]
    const filteredTorrents = [torrent('Obsession.2026.1080p.AMZN.WEB-DL', 2, 'tt4444444')]

    const { result, rerender } = renderHook(({ torrents, lastQuery }) => useTopTitles(torrents, lastQuery), {
      initialProps: { torrents: initialTorrents, lastQuery: '' },
    })

    expect(result.current).toEqual([
      { title: 'Toy Story 5 (2026)', imdb: 'tt1111111' },
      { title: 'Michael (2026)', imdb: 'tt3333333' },
    ])

    rerender({ torrents: filteredTorrents, lastQuery: 'Obsession' })

    expect(result.current).toEqual([
      { title: 'Toy Story 5 (2026)', imdb: 'tt1111111' },
      { title: 'Michael (2026)', imdb: 'tt3333333' },
    ])
  })

  it('refreshes titles after lastQuery is cleared', () => {
    const initialTorrents = [torrent('Toy.Story.5.2026.1080p.DCPRIP', 0, 'tt1111111')]
    const updatedTorrents = [
      torrent('Toy.Story.5.2026.1080p.DCPRIP', 0, 'tt1111111'),
      torrent('Michael (2026) [1080p]', 1, 'tt3333333'),
    ]

    const { result, rerender } = renderHook(({ torrents, lastQuery }) => useTopTitles(torrents, lastQuery), {
      initialProps: { torrents: initialTorrents, lastQuery: '' },
    })

    expect(result.current).toEqual([{ title: 'Toy Story 5 (2026)', imdb: 'tt1111111' }])

    rerender({ torrents: initialTorrents, lastQuery: 'Toy Story' })
    rerender({ torrents: updatedTorrents, lastQuery: '' })

    expect(result.current).toEqual([
      { title: 'Toy Story 5 (2026)', imdb: 'tt1111111' },
      { title: 'Michael (2026)', imdb: 'tt3333333' },
    ])
  })
})
