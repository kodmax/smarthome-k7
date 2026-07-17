import { Box } from '@mui/material'
import { type FC, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHint, AppHintProvider } from './hints'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { usePortraitTopBarOffset } from './hooks/usePortraitTopBarOffset'
import { Offline } from '@/pages/Offline/Offline'
import { PortraitTopBar } from './layout/PortraitTopBar'
import { MenuProvider } from './SideMenu/MenuContext'
import { SideMenu } from './SideMenu/SideMenu'
import { SideMenuOpenToggle } from './SideMenu/SideMenuOpenToggle'

export const AppLayout: FC<Record<string, never>> = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isOnline = useOnlineStatus()
  const { showTopBar, topBarVisible } = usePortraitTopBarOffset(menuOpen)

  return (
    <AppHintProvider>
      <MenuProvider
        value={{
          open: menuOpen,
          onOpen: () => setMenuOpen(true),
          onClose: () => setMenuOpen(false),
        }}
      >
        {isOnline ? (
          <>
            <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
            <AppHint />
            {showTopBar ? <PortraitTopBar visible={topBarVisible} /> : null}
            <SideMenuOpenToggle />
          </>
        ) : null}

        <Box component='main'>{isOnline ? <Outlet /> : <Offline />}</Box>
      </MenuProvider>
    </AppHintProvider>
  )
}
