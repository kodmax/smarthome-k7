import { Box, Card, CardContent, Typography, styled } from '@mui/material'
import { apolloDataTableRowHeight } from '@/cards/components/ApolloDataTable'
import { designTokens } from '@repo/design-tokens'
import type { LucideIcon } from 'lucide-react'
import { type FC, type ReactNode } from 'react'
import { ZOOM_SCALE } from './zoomConstants'
import { ZoomContext } from './ZoomContext'
import { ZoomCurtain } from './ZoomCurtain'

type ApolloCardProps = {
  title: string
  icon: LucideIcon
  children: ReactNode
  cardId: string
  height?: number
  allowZoom?: boolean
  onZoom?: () => void
}

const ApolloCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: designTokens.space[2],
  padding: '12px 12px 12px 16px',
  paddingBottom: designTokens.space[2],
  borderBottom: `${designTokens.borderWidth.hairline}px solid ${theme.vars!.palette.cardHeaderBorder.main}`,
}))

const ApolloCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: designTokens.font.h3.size,
  fontWeight: designTokens.font.h3.weight,
  lineHeight: designTokens.font.h3.lineHeight,
  color: theme.vars!.palette.text.primary,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

const CARD_CONTENT_PADDING_Y_PX = 0.666 * 16 * 2

const apolloCardContentHeight = (rows: number) => `${rows * apolloDataTableRowHeight + CARD_CONTENT_PADDING_Y_PX}px`

const ApolloCardRoot = styled(Card, {
  shouldForwardProp: prop => prop !== 'zoom',
})<{ zoom?: boolean }>(({ zoom }) => ({
  ...(zoom
    ? {
        boxSizing: 'border-box',
        width: `calc(100% / ${ZOOM_SCALE})`,
        height: `min(fit-content, calc(100% / ${ZOOM_SCALE}))`,
        maxHeight: `calc(100% / ${ZOOM_SCALE})`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transform: `scale(${ZOOM_SCALE})`,
        transformOrigin: 'top left',
        WebkitTextSizeAdjust: '100%',
        textSizeAdjust: '100%',
      }
    : {
        maxHeight: '100%',
      }),
}))

const ApolloCardContent = styled(CardContent)({
  boxSizing: 'border-box',
  overflowY: 'auto',
  fontSize: designTokens.font.body.size,
  padding: '0.666rem',
  paddingBottom: 0,
  ':last-child': {
    paddingBottom: '0.666rem',
  },
})

const ApolloCard: FC<ApolloCardProps> = ({
  height = 4,
  children,
  title,
  icon: Icon,
  cardId,
  onZoom,
  allowZoom = true,
}) => {
  return (
    <ZoomCurtain cardId={cardId} allowZoom={allowZoom} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom => (
          <ApolloCardRoot zoom={zoom.active}>
            <ApolloCardHeader>
              <Icon size={designTokens.icon.sizeSm} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
              <ApolloCardTitle variant='h3'>{title}</ApolloCardTitle>
            </ApolloCardHeader>

            <ApolloCardContent
              sx={
                zoom.active
                  ? { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }
                  : { height: apolloCardContentHeight(height) }
              }
            >
              {children}
            </ApolloCardContent>
          </ApolloCardRoot>
        )}
      </ZoomContext.Consumer>
    </ZoomCurtain>
  )
}

export default ApolloCard
