'use client'

import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { type MouseEvent } from 'react'
import { type AppColorMode } from '@repo/styles'

export const ThemeDemo = () => {
  const { mode, setMode } = useColorScheme()

  const handleModeChange = (_event: MouseEvent<HTMLElement>, value: AppColorMode | null) => {
    if (value !== null) {
      setMode(value)
    }
  }

  const selectedMode: AppColorMode = mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'system'

  return (
    <>
      <Typography variant='h1' sx={{ mb: 2 }}>
        Next.js playground
      </Typography>
      <Typography variant='body1' sx={{ mb: 3, color: 'text.secondary' }}>
        MUI theme i typography z @repo/design-tokens — ten sam stack co dashboard Vite.
      </Typography>
      <Typography variant='h3' sx={{ mb: 2 }}>
        Motyw
      </Typography>
      <ToggleButtonGroup exclusive size='large' value={selectedMode} onChange={handleModeChange} aria-label='Motyw'>
        <ToggleButton value='system'>System</ToggleButton>
        <ToggleButton value='light'>Jasny</ToggleButton>
        <ToggleButton value='dark'>Ciemny</ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}
