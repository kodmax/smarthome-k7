import { styled as muiStyled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { FC, ReactNode } from 'react'

export type TagVariant = 'new' | 'neutral'

const TagRoot = muiStyled('span', {
  shouldForwardProp: prop => prop !== 'variant',
})<{ variant: TagVariant }>(({ theme, variant }) => ({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 6px 2px',
  borderRadius: `${designTokens.radius.sm}px`,
  lineHeight: 1,
  ...(variant === 'new'
    ? {
        backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.accentRed.main} 0%, ${theme.vars.palette.accentRed.dark} 100%)`,
        color: theme.vars.palette.accentRed.contrastText,
        fontSize: '0.6em',
        fontWeight: 600,
        textTransform: 'uppercase',
      }
    : {
        backgroundColor: theme.vars.palette.action.hover,
        color: theme.vars.palette.text.primary,
        fontSize: '0.75em',
        fontWeight: 500,
      }),
}))

export const TagGroup = muiStyled('span')({
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: `${designTokens.space[1]}px`,
})

export const Tag: FC<{ variant: TagVariant; children: ReactNode }> = ({ variant, children }) => (
  <TagRoot variant={variant}>{children}</TagRoot>
)
