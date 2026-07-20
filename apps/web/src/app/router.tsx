import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { PersistentPages } from './PersistentPages'
import { Appearance } from '@/pages/Appearance/Appearance'
import { EnergyMeter } from '@/pages/EnergyMeter/EnergyMeter'
import { JobMarket } from '@/pages/JobMarket/JobMarket'
import { Offline } from '@/pages/Offline/Offline'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        element: <PersistentPages />,
        children: [
          {
            index: true,
            element: <Navigate to='/dashboard' replace />,
          },
          {
            path: 'dashboard',
            element: null,
          },
          {
            path: 'energy-meter',
            element: <EnergyMeter />,
          },
          {
            path: 'job-market',
            element: <JobMarket />,
          },
          {
            path: 'appearance',
            element: <Appearance />,
          },
          {
            path: 'offline',
            element: <Offline />,
          },
        ],
      },
    ],
  },
])
