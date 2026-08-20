import { IconButton } from '@mui/material'
import { MenuIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { useMenu } from './MenuContext'

const { icon } = designTokens

export const SideMenuOpenToggle: FC<Record<string, never>> = () => {
  const { open, onOpen } = useMenu()

  if (open) {
    return null
  }

  return (
    <IconButton
      aria-label='Otwórz menu'
      aria-expanded={false}
      onClick={onOpen}
      data-side-menu-toggle=''
      data-open={false}
    >
      <MenuIcon size={icon.sizeXs} strokeWidth={icon.strokeWidth} />
    </IconButton>
  )
}
