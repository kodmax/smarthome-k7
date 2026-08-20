'use client'

import { Box } from '@mui/material'
import { type FC, type ReactNode, useState } from 'react'
import { useOnlineStatus } from '@/app/shell/hooks/useOnlineStatus'
import { OfflineScreen } from '@/app/shell/OfflineScreen'
import { MenuProvider } from '@/app/shell/SideMenu/MenuContext'
import { SideMenu } from '@/app/shell/SideMenu/SideMenu'

type AppShellProps = {
  children: ReactNode
}

export const AppShell: FC<AppShellProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isOnline = useOnlineStatus()

  return (
    <MenuProvider
      value={{
        open: menuOpen,
        onOpen: () => setMenuOpen(true),
        onClose: () => setMenuOpen(false),
      }}
    >
      {isOnline ? <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} /> : null}

      <Box component='main'>{isOnline ? children : <OfflineScreen />}</Box>
    </MenuProvider>
  )
}
