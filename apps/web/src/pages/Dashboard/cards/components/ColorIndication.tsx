import { styled } from '@mui/material'
import type { FC } from 'react'
import { chooseColor } from './chooseColor'

export type ColorIndicationRange = {
  optimal?: number
  highest?: number
  lowest?: number
  reverse?: boolean
}

const Indicator = styled('span')({
  margin: '0 0.5em 0.1666em 0',
  verticalAlign: 'middle',
  display: 'inline-block',
  height: '0.333em',
  width: '0.333em',
})

export const ColorIndicator: FC<{ instant: number; range: ColorIndicationRange }> = ({ instant, range }) => {
  if (range.optimal === undefined) {
    return <span></span>
  } else {
    return <Indicator style={{ backgroundColor: chooseColor(instant, range) }} />
  }
}
