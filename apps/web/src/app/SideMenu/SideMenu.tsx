import { Drawer } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { useEffect, useRef, useState, type FC } from 'react'
import { SideMenuContent } from './SideMenuContent'
import { SideMenuToggle } from './SideMenuToggle'
import { drawerPaperSx } from './drawerLayout'

const { drawerWidth } = designTokens.components.sideMenu

type SideMenuProps = {
  open: boolean
  onClose: () => void
  onToggle: () => void
}

export const SideMenu: FC<SideMenuProps> = ({ open, onClose, onToggle }) => {
  const paperRef = useRef<HTMLDivElement>(null)
  const [measuredDrawerWidth, setMeasuredDrawerWidth] = useState(drawerWidth)

  useEffect(() => {
    const paper = paperRef.current
    if (!open || paper === null) {
      return
    }

    const updateWidth = () => {
      setMeasuredDrawerWidth(paper.getBoundingClientRect().width)
    }

    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(paper)

    return () => observer.disconnect()
  }, [open])

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
            variant: 'sideMenu',
            sx: drawerPaperSx,
            ref: paperRef,
          },
        }}
      >
        <SideMenuContent onNavigate={onClose} />
      </Drawer>

      <SideMenuToggle open={open} drawerWidth={measuredDrawerWidth} onToggle={onToggle} />
    </>
  )
}
