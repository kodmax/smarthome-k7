import { IconButton } from '@mui/material'
import { StyledLucideIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'

type Props = {
  Icon: StyledLucideIcon
  onClick: () => void
  title?: string
}

export const ApolloCardAction: FC<Props> = ({ Icon, onClick, title }) => {
  return (
    <IconButton aria-label={title} onClick={onClick} size='small'>
      <Icon size={designTokens.icon.sizeSm} strokeWidth={designTokens.icon.strokeWidth} />
    </IconButton>
  )
}
