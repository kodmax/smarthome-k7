import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { type TopTitle } from './getTopTitles'
import { TopTitleRow } from './TopTitleRow'
import { TorrentsTable } from './styled'

type TopTitlesTableProps = {
  topTitles: TopTitle[] | undefined
  onTitleSearch: (title: string) => void
}

export const TopTitlesTable: FC<TopTitlesTableProps> = ({ topTitles, onTitleSearch }) => (
  <TorrentsTable>
    <TableBody>
      {topTitles?.map(topTitle => (
        <TopTitleRow key={topTitle.title} topTitle={topTitle} onTitleSearch={onTitleSearch} />
      ))}
    </TableBody>
  </TorrentsTable>
)
