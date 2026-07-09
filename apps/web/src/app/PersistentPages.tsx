import { Box } from '@mui/material'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { type FC } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export const PersistentPages: FC<Record<string, never>> = () => {
  const { pathname } = useLocation()
  const isDashboard = pathname === '/dashboard'

  return (
    <>
      <Box sx={{ display: isDashboard ? 'block' : 'none' }} aria-hidden={!isDashboard}>
        <Dashboard />
      </Box>

      {!isDashboard ? <Outlet /> : null}
    </>
  )
}
