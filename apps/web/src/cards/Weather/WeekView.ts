import styled from '@emotion/styled'

export const WeekContainer = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
})

export const DayWrapper = styled('div')({
  flex: '0 0 calc(100% / 7)',
})
