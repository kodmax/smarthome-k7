import { styled } from '@mui/material'

export const Unit = styled('span')(({ theme }) => ({
  fontSize: '0.8em',
  color: theme.vars.palette.text.secondary,
}))

export const ValueLayout = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  fontFamily: 'monospace',
  verticalAlign: 'middle',
  gap: '0.25em',
})

export const IndicatorSlot = styled('span')({
  flex: '0 0 0.5em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& > span': {
    margin: 0,
  },
})

export const ValueSlot = styled('span')({
  flex: '0 0 4em',
  textAlign: 'right',
  textOverflow: 'ellipsis',
})

export const UnitSlot = styled('span')(({ theme }) => ({
  flex: '0 0 2em',
  fontSize: '0.65em',
  color: theme.vars.palette.text.secondary,
  textAlign: 'left',
}))
