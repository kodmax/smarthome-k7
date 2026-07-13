import { IconButton } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { type FC } from 'react'
import { ApolloTableCell, ApolloTableRow, LinkOpen } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import { useTranslations } from '@/i18n'
import { type TopTitle } from './getTopTitles'

const iconSize = designTokens.icon.sizeXs - 4

type TopTitleRowProps = {
  topTitle: TopTitle
  onTitleSearch: (title: string) => void
}

export const TopTitleRow: FC<TopTitleRowProps> = ({ topTitle: { title, imdb }, onTitleSearch }) => {
  const { t } = useTranslations()
  const searchLabel = `${t.dashboard.torrents.searchFor} ${title}`

  return (
    <ApolloTableRow>
      {imdb ? <LinkOpen href={`https://www.imdb.com/title/${imdb}/`} /> : <ApolloTableCell />}
      <ApolloTableCell>
        {title}
        <IconButton
          aria-label={searchLabel}
          onClick={() => onTitleSearch(title)}
          size='small'
          sx={{ marginLeft: `${designTokens.space[1]}px`, verticalAlign: 'middle' }}
        >
          <ArrowRight size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
        </IconButton>
      </ApolloTableCell>
    </ApolloTableRow>
  )
}
