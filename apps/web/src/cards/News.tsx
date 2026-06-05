import { type FC, useCallback } from 'react'
import zoomBanner from './card-banners/news-zoom.jpg'
import banner from './card-banners/news.jpg'
import { refreshFeeds, useUpdate } from '@repo/feed-client'
import ApolloCard, { ZoomContext } from '../apollo-card/ApolloCard'
import LinkOpen from './components/LinkOpen'
import TablePlaceholder from './components/TablePlaceholder'
import styled from '@emotion/styled'

const Open = styled('td')({
    verticalAlign: 'middle',
    padding: '0 1em 0em',
    width: '1em'
})

export const News: FC<Record<string, never>> = () => {
    const [news, updatedAt] = useUpdate<any>('news')

  const onZoom = useCallback(() => {
    refreshFeeds(['news'])
  }, [])

    return (
        <ApolloCard cardId='news' banner={banner} updatedAt={updatedAt} zoomBanner={zoomBanner} height={6} onZoom={onZoom}>
            <ZoomContext.Consumer>
                { zoom => !news ? (<TablePlaceholder rows={6} graph={false} value={false} />) : (
                    <table className={zoom.active ? '' : 'apollo-data-table'} style={zoom.active
                        ? { fontSize: '0.4em', lineHeight: 1.2 }
                        : { tableLayout: 'fixed', width: '100%' }}>
                        <tbody>
                            {news.map((header: any) => (
                                <tr key={header.href}>
                                    {!zoom.active
                                        ? null
                                        : (
                                            <Open style={{ padding: '0 1em 0em', verticalAlign: 'middle' }}>
                                                <LinkOpen href={header.href} />
                                            </Open>
                                        )}
                                    <td style={ zoom.active ? { paddingBottom: '0em' } : { textAlign: 'left' }}>
                                        {header.title}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </ZoomContext.Consumer>
        </ApolloCard>
    )
}
