import { Drawer } from '@mui/material'
import { type FC } from 'react'
import { SideMenuCloseToggle } from './SideMenuCloseToggle'
import { SideMenuContent } from './SideMenuContent'
import { drawerPaperSx } from './drawerLayout'

type SideMenuProps = {
  open: boolean
  onClose: () => void
}

export const SideMenu: FC<SideMenuProps> = ({ open, onClose }) => {
  return (
    <Drawer
      anchor='left'
      open={open}
      onClose={onClose}
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: {
          variant: 'sideMenu',
          sx: drawerPaperSx,
        },
      }}
    >
      <SideMenuCloseToggle onClose={onClose} />
      <SideMenuContent onNavigate={onClose} />
    </Drawer>
  )
}
