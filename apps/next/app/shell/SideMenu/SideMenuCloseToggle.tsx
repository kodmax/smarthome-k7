import { IconButton } from '@mui/material'
import { CollapseMenuIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { sideMenuScaleMedia } from './sideMenuScaleMedia'

const { icon } = designTokens

type SideMenuCloseToggleProps = {
  onClose: () => void
}

export const SideMenuCloseToggle: FC<SideMenuCloseToggleProps> = ({ onClose }) => {
  return (
    <IconButton
      aria-label='Zwiń menu'
      aria-expanded
      onClick={onClose}
      data-side-menu-toggle=''
      data-open
      sx={theme => ({
        position: 'absolute',
        top: theme.spacing(3),
        right: theme.spacing(3),
        zIndex: 1,
        [sideMenuScaleMedia]: {
          top: theme.spacing(4.5),
          right: theme.spacing(4.5),
        },
      })}
    >
      <CollapseMenuIcon size={icon.sizeXs} strokeWidth={icon.strokeWidth} />
    </IconButton>
  )
}
