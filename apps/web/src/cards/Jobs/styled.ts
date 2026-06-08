import styled from '@emotion/styled'

export const Logo = styled('img')<{ isUnwanted: boolean }>(({ isUnwanted }) => ({
  opacity: isUnwanted ? 0.1 : 1,
  maxHeight: '1em',
}))

export const Company = styled('td')({
  width: '3em',
  textAlign: 'right',
})

export const Open = styled('td')({
  padding: '0 1em 0.25em',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
  width: '3em',
})

export const JobTitle = styled('td')({
  textOverflow: 'ellipsis',
})

export const Salary = styled('td')({
  width: '6em',
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
