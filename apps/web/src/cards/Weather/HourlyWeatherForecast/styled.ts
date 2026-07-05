import { Box, styled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'

const { font, space } = designTokens

export const HOUR_COLUMN_WIDTH = 64
export const HOUR_GAP = space[4]
export const HOUR_ROW_GAP = 4
export const WEATHER_ICON_SIZE = 32
export const PRECIP_ICON_SIZE = 9
export const ROW_FONT_SIZE = Math.round(font.body.size - 2)
export const SUN_FONT_SIZE = Math.round(font.body.size * 0.5)

export const ScrollArea = styled(Box)({
  overflowX: 'auto',
})

export const ForecastRow = styled(Box)({
  display: 'flex',
  gap: HOUR_GAP,
  width: 'max-content',
  marginLeft: 'auto',
})

export const HourColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  width: HOUR_COLUMN_WIDTH,
  textAlign: 'center',
  gap: HOUR_ROW_GAP,
})

export const IconSlot = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: HOUR_COLUMN_WIDTH,
  height: WEATHER_ICON_SIZE,
  overflow: 'visible',
})

export const RowText = styled(Box)({
  fontSize: ROW_FONT_SIZE,
})

export const PrecipRow = styled(Box)({
  fontSize: ROW_FONT_SIZE,
  lineHeight: 1.2,
})

export const SunText = styled(Box)({
  fontSize: SUN_FONT_SIZE,
})
