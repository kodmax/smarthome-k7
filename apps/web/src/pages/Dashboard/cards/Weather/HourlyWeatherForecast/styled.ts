import { Box, styled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'

const { font, space, icon } = designTokens

export const HOUR_COLUMN_WIDTH = 76
export const HOUR_GAP = space[4]
export const HOUR_ROW_GAP = 8
export const WEATHER_ICON_SIZE = 32
export const PRECIP_ICON_SIZE = 9
export const SUN_ROW_WIDTH = HOUR_COLUMN_WIDTH
export const SUN_ICON_SIZE = icon.sizeXs
export const ROW_FONT_SIZE = Math.round(font.body.size - 2)
export const SUN_FONT_SIZE = Math.round(font.body.size - 2)

export const ScrollArea = styled(Box)({
  overflowX: 'auto',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
})

export const ForecastRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: HOUR_GAP,
  width: 'max-content',
  marginLeft: 'auto',
})

export const HourColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[1],
  fontSize: ROW_FONT_SIZE,
  lineHeight: 1.2,
})

export const SunIconSlot = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: SUN_ICON_SIZE,
  height: SUN_ICON_SIZE,
  '& > svg': {
    display: 'block',
  },
})

export const SunUvLabel = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space[1],
  lineHeight: 1,
})

export const SunRow = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[1],
  width: SUN_ROW_WIDTH,
  minHeight: SUN_ICON_SIZE,
  fontSize: SUN_FONT_SIZE,
  lineHeight: 1,
})
