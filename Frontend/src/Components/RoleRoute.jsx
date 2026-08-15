import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

function RoleRoute({ allowedRoles, children }) {
  const { role, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export function FleetManagerRoute({ children }) {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['FLEET_MANAGER']}>{children}</RoleRoute>
    </ProtectedRoute>
  )
}

export function SafetyOfficerRoute({ children }) {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['SAFETY_OFFICER']}>{children}</RoleRoute>
    </ProtectedRoute>
  )
}

export function DispatcherRoute({ children }) {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['DISPATCHER']}>{children}</RoleRoute>
    </ProtectedRoute>
  )
}

export default RoleRoute