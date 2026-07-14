import { IconButton } from '@mui/material'
import type { StyledIconProps, StyledLucideIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC, type MouseEvent } from 'react'
import { cardHintIconColor, type CardHintIconVariant } from './cardHintIconPresets'
import { useAppHint } from './useAppHint'

const { icon } = designTokens

export type CardHintIconProps = {
  Icon: StyledLucideIcon
  variant: CardHintIconVariant
  title: string
  description: string | string[]
}

export const CardHintIcon: FC<CardHintIconProps> = ({ Icon, variant, title, description }) => {
  const { showHint } = useAppHint()
  const iconProps: StyledIconProps = {
    size: icon.sizeSm,
    strokeWidth: icon.strokeWidth,
    color: cardHintIconColor(variant),
    glow: 'default',
    'aria-hidden': true,
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    showHint({
      title,
      description,
      icon: <Icon {...iconProps} />,
    })
  }

  return (
    <IconButton size='small' aria-label={title} onClick={handleClick} sx={{ p: 0.25, flex: '0 0 auto' }}>
      <Icon {...iconProps} />
    </IconButton>
  )
}
