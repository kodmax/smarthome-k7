import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { styled } from '@mui/material/styles'

export const PillToggleButtonGroup = styled(ToggleButtonGroup, {
  shouldForwardProp: prop => prop !== 'pill',
})<{ pill?: boolean }>({})
