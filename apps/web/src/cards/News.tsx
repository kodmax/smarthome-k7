import { TableBody } from '@mui/material'
import { type FC, useCallback } from 'react'
import { NewsIcon } from '@repo/assets'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloDataTable, ApolloTableCell, ApolloTableRow, LinkOpen, TablePlaceholder } from '@/card-components'
import { NewsFeed } from '@repo/types'

export const News: FC<Record<string, never>> = () => {
  const news = useFeed<NewsFeed>('news')

  const onZoom = useCallback(() => {
    refreshFeeds(['news'])
  }, [])

  return (
    <ApolloCard cardId='news' title='Wiadomości' icon={NewsIcon} height={9} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom =>
          !news ? (
            <TablePlaceholder rows={10} graph={false} value={false} />
          ) : (
            <ApolloDataTable style={{ tableLayout: 'fixed' }}>
              <TableBody>
                {news.articles.map(article =>
                  zoom.active ? (
                    <ApolloTableRow key={article.href}>
                      <LinkOpen href={article.href} />
                      <ApolloTableCell>{article.title}</ApolloTableCell>
                      <ApolloTableCell sx={{ width: 0 }}></ApolloTableCell>
                    </ApolloTableRow>
                  ) : (
                    <ApolloTableRow key={article.href}>
                      <ApolloTableCell sx={{ textAlign: 'left' }}>{article.title}</ApolloTableCell>
                    </ApolloTableRow>
                  ),
                )}
              </TableBody>
            </ApolloDataTable>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
