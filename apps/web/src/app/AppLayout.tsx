import { Box } from '@mui/material'
import { type FC, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SideMenu } from './SideMenu/SideMenu'

export const AppLayout: FC<Record<string, never>> = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onToggle={() => setMenuOpen(open => !open)} />

      <Box component='main'>
        <Outlet />
      </Box>
    </>
  )
}
