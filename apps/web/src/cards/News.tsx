import { TableBody } from '@mui/material'
import { type FC, useCallback } from 'react'
import { NewsIcon } from '@repo/assets'
import { refreshFeeds, useCommand, useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloDataTable, ApolloTableCell, ApolloTableRow, LinkOpen, TablePlaceholder } from '@/card-components'
import { NewsFeed } from '@repo/types'

export const News: FC<Record<string, never>> = () => {
  const news = useFeed<NewsFeed>('news')
  const read = useCommand('news', 'read')

  const onZoom = useCallback(() => {
    refreshFeeds(['news'])
  }, [])

  const onOpenArticle = useCallback(
    (uid: string) => {
      read(uid)
    },
    [read],
  )

  return (
    <ApolloCard cardId='news' title='Wiadomości' icon={NewsIcon} height={9} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom =>
          !news ? (
            <TablePlaceholder rows={10} graph={false} value={false} />
          ) : (
            <ApolloDataTable style={{ tableLayout: 'fixed' }}>
              <TableBody>
                {news.articles
                  .filter(article => !article.read)
                  .map(article =>
                    zoom.active ? (
                      <ApolloTableRow key={article.uid}>
                        <LinkOpen href={article.href} onClick={() => onOpenArticle(article.uid)} />
                        <ApolloTableCell>{article.title}</ApolloTableCell>
                        <ApolloTableCell sx={{ width: 0 }}></ApolloTableCell>
                      </ApolloTableRow>
                    ) : (
                      <ApolloTableRow key={article.uid}>
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
