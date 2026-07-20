import { Box } from '@mui/material'
import { type FC, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHint, AppHintProvider } from './hints'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { Offline } from '@/pages/Offline/Offline'
import { MenuProvider } from './SideMenu/MenuContext'
import { SideMenu } from './SideMenu/SideMenu'

export const AppLayout: FC<Record<string, never>> = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isOnline = useOnlineStatus()

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
          </>
        ) : null}

        <Box component='main'>{isOnline ? <Outlet /> : <Offline />}</Box>
      </MenuProvider>
    </AppHintProvider>
  )
}
