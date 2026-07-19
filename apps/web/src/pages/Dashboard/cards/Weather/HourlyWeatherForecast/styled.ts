import { Box, styled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'

const { space } = designTokens

export const WEATHER_ICON_SIZE = 32
export const HOUR_GAP = space[8]

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
