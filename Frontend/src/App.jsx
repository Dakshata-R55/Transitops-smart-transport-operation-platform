import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import SignUpPage from './Pages/SignUpPage'
import DashboardPage from './Pages/DashboardPage'
import FleetVehiclesPage from './Pages/FleetVehiclesPage'
import SafetyOfficerDriversPage from './Pages/SafetyOfficerDriversPage'
import DispatcherTripsPage from './Pages/DispatcherTripsPage'
import UnauthorizedPage from './Pages/UnauthorizedPage'
import ProtectedRoute from './Components/ProtectedRoute'
import FleetMaintenancePage from './Pages/FleetMaintenancePage'
import {
  FleetManagerRoute,
  SafetyOfficerRoute,
  DispatcherRoute,
} from './Components/RoleRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fleet/vehicles"
          element={
            <FleetManagerRoute>
              <FleetVehiclesPage />
            </FleetManagerRoute>
          }
        />

<Route
  path="/fleet/maintenance"
  element={
    <FleetManagerRoute>
      <FleetMaintenancePage />
    </FleetManagerRoute>
  }
/>


        <Route
          path="/safety/drivers"
          element={
            <SafetyOfficerRoute>
              <SafetyOfficerDriversPage />
            </SafetyOfficerRoute>
          }
        />

        <Route
          path="/dispatcher/trips"
          element={
            <DispatcherRoute>
              <DispatcherTripsPage />
            </DispatcherRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App