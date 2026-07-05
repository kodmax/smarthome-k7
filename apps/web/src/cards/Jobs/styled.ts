import styled from '@emotion/styled'
import { ApolloTableCell } from '@/card-components'

export const Open = styled(ApolloTableCell)({
  padding: '0 1em 0.25em',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
  width: '1em',
  borderBottom: 'none',
})

export const JobTitle = styled(ApolloTableCell)({
  textOverflow: 'ellipsis',
  padding: 0,
  borderBottom: 'none',
})

export const Salary = styled(ApolloTableCell)({
  width: '6em',
  padding: 0,
  borderBottom: 'none',
})

export const SkillsList = styled('ul')({
  display: 'inline-block',
  padding: 0,
  margin: '0 1rem',
})

export const Skill = styled('li')<{ level?: number }>(() => ({
  display: 'inline-block',
  backgroundColor: '#f0f0f0',
  color: `rgba(32, 32, 32)`,
  fontSize: '0.7em',
  padding: '2px',
  margin: '0 2px',
  verticalAlign: 'middle',
}))
