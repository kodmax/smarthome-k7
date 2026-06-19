import styled from '@emotion/styled'

export const DayWrapper = styled('div')({
  flex: '0 0 calc(100% / 7 - 1.333em)',
  display: 'flex',
  justifyContent: 'center',
  padding: '0.666em 0.666em 0',
})

export const Icon = styled('div')({
  backgroundSize: 'contain',
  width: '2.5em',
  height: '2.5em',
})
