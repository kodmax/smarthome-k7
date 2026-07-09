import { IconButton, TableBody } from '@mui/material'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { EyeOff, Undo2 } from 'lucide-react'
import { NewsIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { refreshFeeds, useCommand, useFeed } from '@repo/feed-client'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import {
  ApolloDataTable,
  ApolloTableCell,
  ApolloTableRow,
  LinkOpen,
  TableEmptyMessage,
  TablePlaceholder,
} from '@/card-components'
import { NewsFeed } from '@repo/types'

const iconSize = designTokens.icon.sizeXs - 4

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

  const articles = useMemo(() => {
    if (news === undefined) {
      return undefined
    }

    return editMode
      ? news.articles.slice().sort((a, b) => +a.read - +b.read)
      : news.articles.filter(article => !article.read)
  }, [editMode, news])

  return (
    <ApolloCard
      cardId='news'
      title='Wiadomości'
      icon={NewsIcon}
      height={9}
      onZoom={onZoom}
      onEditPreferences={onEditPreferences}
    >
      {!articles ? (
        <TablePlaceholder rows={10} graph={false} value={false} />
      ) : articles.length === 0 ? (
        <TableEmptyMessage>Na razie nie ma tu nic nowego</TableEmptyMessage>
      ) : (
        <ApolloDataTable style={{ tableLayout: 'fixed' }}>
          <TableBody>
            {articles.map(article =>
              zoom ? (
                <ApolloTableRow key={article.uid}>
                  <LinkOpen href={article.href} onClick={() => onOpenArticle(article.uid)} />
                  {editMode ? (
                    <ApolloTableCell
                      sx={{
                        verticalAlign: 'middle',
                        boxSizing: 'border-box',
                        width: '4em',
                        textOverflow: 'clip',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {article.read ? (
                        <IconButton
                          aria-label='Oznacz jako nieprzeczytane'
                          onClick={() => onUnreadArticle(article.uid)}
                          size='small'
                        >
                          <Undo2 size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label='Oznacz jako przeczytane'
                          onClick={() => onOpenArticle(article.uid)}
                          size='small'
                        >
                          <EyeOff size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
                        </IconButton>
                      )}
                    </ApolloTableCell>
                  ) : null}
                  <ApolloTableCell>{article.title}</ApolloTableCell>
                  <ApolloTableCell sx={{ width: 0 }}></ApolloTableCell>
                </ApolloTableRow>
              ) : (
                <ApolloTableRow key={article.uid}>
                  <LinkOpen href={article.href} onClick={() => onOpenArticle(article.uid)} />
                  <ApolloTableCell>{article.title}</ApolloTableCell>
                </ApolloTableRow>
              ),
            )}
          </TableBody>
        </ApolloDataTable>
      )}
    </ApolloCard>
  )
}
