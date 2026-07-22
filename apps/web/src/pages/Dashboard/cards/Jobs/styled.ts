import styled from '@emotion/styled'
import { styled as muiStyled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ApolloTableCell } from '@/card-components'

export const JobTitleCell = styled(ApolloTableCell)({
  padding: 0,
  borderBottom: 'none',
  overflow: 'hidden',
  textOverflow: 'clip',
  whiteSpace: 'normal',
  maxWidth: '100%',
})

export const JobTitleContent = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  maxWidth: '100%',
  minWidth: 0,
  verticalAlign: 'middle',
  gap: `${designTokens.space[1]}px`,
})

export const JobTitleText = styled('span')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
})

export const JobNewTag = muiStyled('span')(({ theme }) => ({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.accentRed.main} 0%, ${theme.vars.palette.accentRed.dark} 100%)`,
  color: theme.vars.palette.accentRed.contrastText,
  fontSize: '0.6em',
  fontWeight: 600,
  textTransform: 'uppercase',
  padding: '3px 6px 2px',
  borderRadius: `${designTokens.radius.sm}px`,
  lineHeight: 1,
}))

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
