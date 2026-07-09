import { Drawer } from '@mui/material'
import { type FC } from 'react'
import { SideMenuContent } from './SideMenuContent'
import { SideMenuToggle } from './SideMenuToggle'
import { drawerPaperSx } from './drawerLayout'

type SideMenuProps = {
  open: boolean
  onClose: () => void
  onToggle: () => void
}

export const SideMenu: FC<SideMenuProps> = ({ open, onClose, onToggle }) => {
  return (
    <>
      <Drawer
        anchor='left'
        open={open}
        onClose={onClose}
        variant='temporary'
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: drawerPaperSx,
          },
        }}
      >
        <SideMenuContent onNavigate={onClose} />
      </Drawer>

      <SideMenuToggle open={open} onToggle={onToggle} />
    </>
  )
}
