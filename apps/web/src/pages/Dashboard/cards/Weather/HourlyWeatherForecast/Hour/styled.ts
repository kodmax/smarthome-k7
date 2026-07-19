import { Box, styled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { WEATHER_ICON_SIZE } from '../styled'

const { font, space, icon } = designTokens

export const HOUR_COLUMN_GAP = 16
export const HOUR_ROW_GAP = 4
export const DETAILS_ICON_SIZE = icon.sizeXs
const ROW_FONT_SIZE = Math.round(font.body.size - 2)

export const HourRoot = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: HOUR_ROW_GAP,
  flexShrink: 0,
  fontSize: ROW_FONT_SIZE,
  lineHeight: 1.2,
})

export const HourColumns = styled(Box)({
  display: 'flex',
  gap: HOUR_COLUMN_GAP,
})

export const HourColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: HOUR_ROW_GAP,
})

export const WeatherIconSlot = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  height: WEATHER_ICON_SIZE,
})

export const DetailsRow = styled(Box)({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: space[1],
})

export const WindDetailsRow = styled(DetailsRow)({
  whiteSpace: 'nowrap',
})

export const SmallIconSlot = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  flexShrink: 0,
  width: DETAILS_ICON_SIZE,
  height: DETAILS_ICON_SIZE,
  '& > svg': {
    display: 'block',
  },
})

export const ValueWithUnit = styled(Box)({
  display: 'inline-flex',
  alignItems: 'baseline',
})

export const TemperatureValue = styled(ValueWithUnit)({
  fontSize: '1.3em',
})

export const DayLabelWrapper = styled(Box)({
  marginBottom: space[1],
})

export const SunRowContainer = styled(Box)({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: space[1],
  minHeight: DETAILS_ICON_SIZE,
})
