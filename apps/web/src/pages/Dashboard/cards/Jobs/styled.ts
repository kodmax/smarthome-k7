import styled from '@emotion/styled'
import { designTokens } from '@repo/design-tokens'
import { ApolloTableCell } from '@/card-components'

export const JobTitle = styled(ApolloTableCell)({
  textOverflow: 'ellipsis',
  padding: 0,
  borderBottom: 'none',
})

export const Salary = styled(ApolloTableCell)({
  width: '128px',
  padding: 0,
  borderBottom: 'none',
  textAlign: 'right',
})

export const SkillsList = styled('ul')({
  display: 'inline-block',
  padding: 0,
  margin: `0 ${designTokens.space[4]}px`,
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
