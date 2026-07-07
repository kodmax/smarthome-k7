import { IconButton, TableBody } from '@mui/material'
import { type FC, useCallback, useEffect, useState } from 'react'
import { Undo2 } from 'lucide-react'
import { NewsIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { refreshFeeds, useCommand, useFeed } from '@repo/feed-client'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { ApolloDataTable, ApolloTableCell, ApolloTableRow, LinkOpen, TablePlaceholder } from '@/card-components'
import { NewsFeed } from '@repo/types'

export const News: FC<Record<string, never>> = () => {
  const [editMode, setEditMode] = useState<boolean>(false)

  const zoom = useZoom('news')
  const news = useFeed<NewsFeed>('news')

  const read = useCommand('news', 'read')
  const unread = useCommand('news', 'unread')

  const onZoom = useCallback(() => {
    refreshFeeds(['news'])
  }, [])

  const onOpenArticle = useCallback(
    (uid: string) => {
      read(uid)
    },
    [read],
  )

  const onUnreadArticle = useCallback(
    (uid: string) => {
      unread(uid)
    },
    [unread],
  )

  const onEditPreferences = useCallback(() => {
    setEditMode(!editMode)
  }, [editMode])

  useEffect(() => {
    if (!zoom) {
      setEditMode(false)
    }
  }, [zoom])

  return (
    <ApolloCard
      cardId='news'
      title='Wiadomości'
      icon={NewsIcon}
      height={9}
      onZoom={onZoom}
      onEditPreferences={onEditPreferences}
    >
      {!news ? (
        <TablePlaceholder rows={10} graph={false} value={false} />
      ) : (
        <ApolloDataTable style={{ tableLayout: 'fixed' }}>
          <TableBody>
            {news.articles
              .filter(article => (editMode ? article.read : !article.read))
              .map(article =>
                zoom ? (
                  <ApolloTableRow key={article.uid}>
                    {editMode ? (
                      <ApolloTableCell
                        sx={{ verticalAlign: 'middle', boxSizing: 'border-box', width: '1em', textOverflow: 'clip' }}
                      >
                        <IconButton
                          aria-label='Oznacz jako nieprzeczytane'
                          onClick={() => onUnreadArticle(article.uid)}
                          size='small'
                        >
                          <Undo2
                            size={designTokens.icon.sizeXs - 4}
                            strokeWidth={designTokens.icon.strokeWidth}
                            aria-hidden
                          />
                        </IconButton>
                      </ApolloTableCell>
                    ) : (
                      <LinkOpen href={article.href} onClick={() => onOpenArticle(article.uid)} />
                    )}
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
      )}
    </ApolloCard>
  )
}
