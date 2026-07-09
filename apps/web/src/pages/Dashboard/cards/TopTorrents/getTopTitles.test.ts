import { Torrent } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { exampleTitles } from './fixtures/exampleTitles'
import { getTopTitles } from './getTopTitles'
import { compareTitle } from './unifyTitle'

const torrent = (name: string, index: number, imdb: string | null = 'tt0000000'): Torrent => ({
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

describe('getTopTitles', () => {
  it('returns unified unique titles in list order', () => {
    const torrents = [
      torrent('Obsession.2026.1080p.AMZN.WEB-DL', 0, 'tt1111111'),
      torrent('Masters of the Universe (2026) [1080p]', 1, 'tt2222222'),
      torrent('Obsession (2025) [1080p]', 2, 'tt3333333'),
      torrent('The.Sheep.Detectives.2026.1080p.WEBRip', 3, 'tt4444444'),
      torrent('Project Hail Mary (2026) [1080p]', 4, 'tt5555555'),
      torrent('Obsession.2026.1080p.TELESYNC.x264', 5, 'tt6666666'),
    ]

    expect(getTopTitles(torrents)).toEqual([
      { title: 'Obsession (2026)', imdb: 'tt1111111' },
      { title: 'Masters of the Universe (2026)', imdb: 'tt2222222' },
      { title: 'Obsession (2025)', imdb: 'tt3333333' },
      { title: 'The Sheep Detectives (2026)', imdb: 'tt4444444' },
      { title: 'Project Hail Mary (2026)', imdb: 'tt5555555' },
    ])
  })

  it('uses imdb from a later torrent when the first one is missing it', () => {
    const torrents = [
      torrent('Michael.2026.1080p.AMZN.WEB-DL', 0, null),
      torrent('Michael 2026 1080p WEB-DL HEVC x265 5.1 BONE', 1, 'tt11378946'),
      torrent('Michael (2026) [1080p]', 2, null),
    ]

    expect(getTopTitles(torrents)).toEqual([{ title: 'Michael (2026)', imdb: 'tt11378946' }])
  })

  it('returns null imdb when no torrent in the group has it', () => {
    const torrents = [
      torrent('Michael.2026.1080p.AMZN.WEB-DL', 0, null),
      torrent('Michael 2026 1080p WEB-DL HEVC x265 5.1 BONE', 1, null),
    ]

    expect(getTopTitles(torrents)).toEqual([{ title: 'Michael (2026)', imdb: null }])
  })

  it('deduplicates example fixture titles', () => {
    const torrents = exampleTitles.map((name, index) => torrent(name, index))
    const titles = getTopTitles(torrents)

    expect(titles).toHaveLength(75)
    expect(titles[0]).toEqual({ title: 'Obsession (2026)', imdb: 'tt0000000' })
    expect(titles.filter(title => compareTitle(title.title) === 'obsession 2026')).toHaveLength(1)
    expect(titles.filter(title => compareTitle(title.title) === 'the sheep detectives 2026')).toHaveLength(1)
    expect(titles.filter(title => compareTitle(title.title) === 'masters of the universe 2026')).toHaveLength(1)
    expect(titles.filter(title => compareTitle(title.title) === 'master of the universe 2026')).toHaveLength(1)
  })
})
