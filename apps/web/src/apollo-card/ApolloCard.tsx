import { Card, CardContent, CardMedia, styled } from '@mui/material'
import { type FC, type ReactNode } from 'react'
import { ZoomContext, ZoomCurtain } from './ZoomCurtain'

type ApolloCardProps = {
  zoomBanner?: string
  children: ReactNode
  banner: string
  cardId: string
  height?: number
  allowZoom?: boolean
  onZoom?: () => void
}

const ApolloCardContent = styled(CardContent)({
  boxSizing: 'border-box',
  overflowY: 'auto',
  padding: '0.666rem',
  paddingBottom: 0,
  ':last-child': {
    paddingBottom: '0.666rem',
  },
})

const ApolloCard: FC<ApolloCardProps> = ({
  height = 4,
  children,
  banner,
  zoomBanner,
  cardId,
  onZoom,
  allowZoom = true,
}) => {
  return (
    <ZoomCurtain cardId={cardId} allowZoom={allowZoom} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom => (
          <Card sx={{ maxHeight: '100%' }}>
            <CardMedia image={zoom.active && zoomBanner ? zoomBanner : banner} style={{ height: '3em' }} />

            <ApolloCardContent
              sx={zoom.active ? { maxHeight: 'calc(80vh - 4em)' } : { height: `${height * 1.362 + 2}em` }}
            >
              {children}
            </ApolloCardContent>
          </Card>
        )}
      </ZoomContext.Consumer>
    </ZoomCurtain>
  )
}

export default ApolloCard
