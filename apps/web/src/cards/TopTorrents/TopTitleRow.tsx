import { IconButton } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { type FC } from 'react'
import { ApolloTableCell, ApolloTableRow, LinkOpen } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { type TopTitle } from './getTopTitles'

const iconSize = designTokens.icon.sizeXs - 4

type TopTitleRowProps = {
  topTitle: TopTitle
  onTitleSearch: (title: string) => void
}

export const TopTitleRow: FC<TopTitleRowProps> = ({ topTitle: { title, imdb }, onTitleSearch }) => (
  <ApolloTableRow>
    {imdb ? <LinkOpen href={`https://www.imdb.com/title/${imdb}/`} /> : <ApolloTableCell />}
    <ApolloTableCell sx={{ textAlign: 'left !important' }}>
      {title}
      <IconButton
        aria-label={`Search torrents for ${title}`}
        onClick={() => onTitleSearch(title)}
        size='small'
        sx={{ marginLeft: '0.35em', verticalAlign: 'middle' }}
      >
        <ArrowRight size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
      </IconButton>
    </ApolloTableCell>
  </ApolloTableRow>
)
