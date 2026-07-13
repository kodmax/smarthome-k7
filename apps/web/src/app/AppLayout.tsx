import { Box } from '@mui/material'
import { type FC, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { usePortraitTopBarOffset } from './hooks/usePortraitTopBarOffset'
import { PortraitTopBar } from './layout/PortraitTopBar'
import { MenuProvider } from './SideMenu/MenuContext'
import { SideMenu } from './SideMenu/SideMenu'
import { SideMenuOpenToggle } from './SideMenu/SideMenuOpenToggle'

export const AppLayout: FC<Record<string, never>> = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { showTopBar, topBarVisible } = usePortraitTopBarOffset(menuOpen)

  return (
    <MenuProvider
      value={{
        open: menuOpen,
        onOpen: () => setMenuOpen(true),
        onClose: () => setMenuOpen(false),
      }}
    >
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {showTopBar ? <PortraitTopBar visible={topBarVisible} /> : null}
      <SideMenuOpenToggle />

      <Box component='main'>
        <Outlet />
      </Box>
    </MenuProvider>
  )
}
