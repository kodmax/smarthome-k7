import { type FC, useCallback } from 'react'
import zoomBanner from './card-banners/news-zoom.jpg'
import banner from './card-banners/news.jpg'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { ApolloDataTable, LinkOpen, TablePlaceholder } from '@/card-components'
import styled from '@emotion/styled'
import { NewsFeed } from '@repo/types'

const Open = styled('td')({
  verticalAlign: 'middle',
  padding: '0 1em 0em',
  width: '1em',
})

export const News: FC<Record<string, never>> = () => {
  const news = useFeed<NewsFeed>('news')

  const onZoom = useCallback(() => {
    refreshFeeds(['news'])
  }, [])

  return (
    <ApolloCard cardId='news' banner={banner} zoomBanner={zoomBanner} height={10} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom =>
          !news ? (
            <TablePlaceholder rows={10} graph={false} value={false} />
          ) : zoom.active ? (
            <table style={{ fontSize: '0.4em', lineHeight: 1.2 }}>
              <tbody>
                {news.articles.map(article => (
                  <tr key={article.href}>
                    <Open style={{ padding: '0 1em 0em', verticalAlign: 'middle' }}>
                      <LinkOpen href={article.href} />
                    </Open>
                    <td style={{ paddingBottom: '0em' }}>{article.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <ApolloDataTable style={{ tableLayout: 'fixed' }}>
              <tbody>
                {news.articles.map(article => (
                  <tr key={article.href}>
                    <td style={{ textAlign: 'left' }}>{article.title}</td>
                  </tr>
                ))}
              </tbody>
            </ApolloDataTable>
          )
        }
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}
