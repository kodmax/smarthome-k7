import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Dashboard } from '@/pages/Dashboard/Dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/dashboard' replace />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
])
