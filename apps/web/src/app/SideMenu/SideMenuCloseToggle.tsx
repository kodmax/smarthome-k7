import { IconButton } from '@mui/material'
import { CollapseMenuIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import {
  toggleCenterFromDrawerRight,
  toggleCenterFromDrawerRightBelow2xl,
  toggleTopOnDrawer,
  toggleTopOnDrawerBelow2xl,
} from './drawerLayout'
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
      sx={{
        position: 'absolute',
        top: toggleTopOnDrawer,
        left: toggleCenterFromDrawerRight,
        transform: 'translateX(-50%)',
        zIndex: 1,
        [sideMenuScaleMedia]: {
          top: toggleTopOnDrawerBelow2xl,
          left: toggleCenterFromDrawerRightBelow2xl,
        },
      }}
    >
      <CollapseMenuIcon size={icon.sizeXs} strokeWidth={icon.strokeWidth} />
    </IconButton>
  )
}
