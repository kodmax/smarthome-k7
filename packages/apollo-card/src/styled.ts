import { Box, Card, CardContent, Typography, styled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { apolloCardHeaderMinHeight } from './cardHeaderLayout'
import { ZOOM_SCALE } from './ZoomCurtain/zoomConstants'

const { font, space } = designTokens

const CARD_CONTENT_PADDING_TOP = space[3]
const CARD_CONTENT_PADDING_BOTTOM = space[3]
const CARD_CONTENT_PADDING_X = space[4]

const CARD_CONTENT_ROW_SLACK = 1
const CARD_CONTENT_HEIGHT_BUFFER = 2

export const apolloCardRowHeight = Math.ceil(font.body.size * font.body.lineHeight)
export const apolloCardContentRowHeight = apolloCardRowHeight + CARD_CONTENT_ROW_SLACK

export const apolloCardContentHeight = (rows: number) =>
  `${rows * apolloCardContentRowHeight + CARD_CONTENT_PADDING_TOP + CARD_CONTENT_PADDING_BOTTOM + CARD_CONTENT_HEIGHT_BUFFER}px`

export const ApolloCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: designTokens.space[2],
  minHeight: apolloCardHeaderMinHeight,
  padding: '12px 12px 12px 16px',
  paddingBottom: designTokens.space[2],
  borderBottom: `${designTokens.borderWidth.hairline}px solid ${theme.vars.palette.cardHeaderBorder.main}`,
}))

export const ApolloCardTitle = styled(Typography)({
  fontSize: designTokens.font.h3.size,
  fontWeight: designTokens.font.h3.weight,
  lineHeight: designTokens.font.h3.lineHeight,
  flex: '0 0 auto',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const ApolloCardHeadingInfo = styled(Box)(({ theme }) => ({
  fontSize: designTokens.font.h3.size - 6,
  fontWeight: 500,
  lineHeight: designTokens.font.h3.lineHeight,
  color: theme.vars.palette.text.secondary,
  flex: 1,
  minWidth: 0,
  overflow: 'visible',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  '& > span': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
}))

export const Actions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
})

export const ApolloCardRoot = styled(Card, {
  shouldForwardProp: prop => prop !== 'zoom',
})<{ zoom?: boolean }>(({ zoom }) => ({
  position: 'relative',
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

export const ApolloCardContentArea = styled(Box, {
  shouldForwardProp: prop => prop !== 'zoom',
})<{ zoom?: boolean }>(({ zoom }) => ({
  position: 'relative',
  ...(zoom ? { flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' } : {}),
}))

export const ApolloCardTopFade = styled(Box)(({ theme }) => ({
  position: 'absolute',
  insetInline: 0,
  top: 0,
  height: `${CARD_CONTENT_PADDING_TOP}px`,
  pointerEvents: 'none',
  zIndex: 1,
  backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.background.paper} 0%, color-mix(in srgb, ${theme.vars.palette.background.paper} 45%, transparent) 55%, transparent 100%)`,
}))

export const ApolloCardBottomFade = styled(Box)(({ theme }) => ({
  position: 'absolute',
  insetInline: 0,
  bottom: 0,
  height: `${CARD_CONTENT_PADDING_BOTTOM}px`,
  pointerEvents: 'none',
  zIndex: 1,
  backgroundImage: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, ${theme.vars.palette.background.paper} 45%, transparent) 45%, ${theme.vars.palette.background.paper} 100%)`,
}))

export const ApolloCardContent = styled(CardContent, {
  shouldForwardProp: prop => prop !== 'rows',
})<{ rows?: number }>(({ rows }) => ({
  boxSizing: 'border-box',
  overflowY: 'auto',
  fontSize: designTokens.font.body.size,
  WebkitTextSizeAdjust: '100%',
  textSizeAdjust: '100%',
  padding: `${CARD_CONTENT_PADDING_TOP}px ${CARD_CONTENT_PADDING_X}px ${CARD_CONTENT_PADDING_BOTTOM}px`,
  ...(rows !== undefined ? { height: apolloCardContentHeight(rows) } : {}),
}))
