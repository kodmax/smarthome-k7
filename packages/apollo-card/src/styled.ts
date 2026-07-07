import { Box, Card, CardContent, Typography, styled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ZOOM_SCALE } from './ZoomCurtain/zoomConstants'

const { font } = designTokens

const apolloCardRowHeight = font.body.size * font.body.lineHeight + 3
const CARD_CONTENT_PADDING_Y_PX = 0.666 * 16 * 2

export const apolloCardContentHeight = (rows: number) => `${rows * apolloCardRowHeight + CARD_CONTENT_PADDING_Y_PX}px`

export const ApolloCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: designTokens.space[2],
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
  fontWeight: designTokens.font.h3.weight,
  lineHeight: designTokens.font.h3.lineHeight,
  color: theme.vars.palette.text.disabled,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'flex',
  justifyContent: 'flex-end',
  whiteSpace: 'nowrap',
}))

export const Actions = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
})

export const ApolloCardRoot = styled(Card, {
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

export const ApolloCardContent = styled(CardContent)({
  boxSizing: 'border-box',
  overflowY: 'auto',
  fontSize: designTokens.font.body.size,
  padding: '0.666rem',
  paddingBottom: 0,
  ':last-child': {
    paddingBottom: '0.666rem',
  },
})
