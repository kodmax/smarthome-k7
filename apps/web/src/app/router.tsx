import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { RouteErrorPage } from './errors'
import { Appearance } from '@/pages/Appearance/Appearance'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { EnergyMeter } from '@/pages/EnergyMeter/EnergyMeter'
import { JobMarket } from '@/pages/JobMarket/JobMarket'
import { NotFound } from '@/pages/NotFound/NotFound'
import { Offline } from '@/pages/Offline/Offline'
import { StockMarket } from '@/pages/StockMarket/StockMarket'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to='/dashboard' replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
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
        path: 'stock-market',
        element: <StockMarket />,
      },
      {
        path: 'appearance',
        element: <Appearance />,
      },
      {
        path: 'offline',
        element: <Offline />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
