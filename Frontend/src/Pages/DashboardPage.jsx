import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  fetchDashboardData,
  computeDashboardKpis,
  VEHICLE_TYPES,
  VEHICLE_STATUSES,
  REGIONS,
} from '../services/dashboardService'
import '../Styles/dashboard.css'

const EMPTY_FILTERS = {
  type: '',
  status: '',
  region: '',
}

function DashboardPage() {
  const { user, role, logoutUser } = useAuth()
  const navigate = useNavigate()

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trips, setTrips] = useState([])
  const [loadErrors, setLoadErrors] = useState([])
  const [pageError, setPageError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadDashboardData() {
    setIsLoading(true)
    setPageError('')

    try {
      const data = await fetchDashboardData()
      setVehicles(data.vehicles)
      setDrivers(data.drivers)
      setTrips(data.trips)
      setLoadErrors(data.loadErrors)
    } catch (error) {
      setPageError(error.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const kpis = computeDashboardKpis(vehicles, drivers, trips, appliedFilters)

  function handleApplyFilters(event) {
    event.preventDefault()
    setAppliedFilters(filters)
  }

  function handleResetFilters() {
    setFilters(EMPTY_FILTERS)
    setAppliedFilters(EMPTY_FILTERS)
  }

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Operations Dashboard</h1>
            <p className="auth-subtitle">
              Welcome, {user?.fullName || user?.email} · Role: {role}
            </p>
          </div>
          <button type="button" className="auth-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {pageError && <div className="form-error">{pageError}</div>}

        {loadErrors.length > 0 && (
          <div className="info-banner">
            {loadErrors.map((message) => (
              <div key={message}>{message}</div>
            ))}
          </div>
        )}

        <div className="dashboard-card">
          <h2>Filters</h2>
          <form className="dashboard-filters" onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label htmlFor="filterType">Vehicle Type</label>
              <select
                id="filterType"
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="">All Types</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="filterStatus">Vehicle Status</label>
              <select
                id="filterStatus"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="">All Statuses</option>
                {VEHICLE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="filterRegion">Region</label>
              <select
                id="filterRegion"
                value={filters.region}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, region: e.target.value }))
                }
              >
                <option value="">All Regions</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="auth-button">
              Apply Filters
            </button>
            <button
              type="button"
              className="auth-button"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </form>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Active Vehicles</div>
            <div className="kpi-value">
              {isLoading ? '...' : kpis.activeVehicles}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Available Vehicles</div>
            <div className="kpi-value">
              {isLoading ? '...' : kpis.availableVehicles}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Vehicles in Maintenance</div>
            <div className="kpi-value">
              {isLoading ? '...' : kpis.vehiclesInMaintenance}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Active Trips</div>
            <div className="kpi-value">
              {isLoading ? '...' : kpis.activeTrips}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Pending Trips</div>
            <div className="kpi-value">
              {isLoading ? '...' : kpis.pendingTrips}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Drivers On Duty</div>
            <div className="kpi-value">
              {isLoading ? '...' : kpis.driversOnDuty}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Fleet Utilization</div>
            <div className={`kpi-value ${!isLoading ? 'percent' : ''}`}>
              {isLoading ? '...' : kpis.fleetUtilization}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Quick Links</h2>
          <div className="quick-links">
            {role === 'FLEET_MANAGER' && (
              <>
                <Link to="/fleet/vehicles" className="auth-button" style={{ textDecoration: 'none' }}>
                  Manage Vehicles
                </Link>
                <Link to="/fleet/maintenance" className="auth-button" style={{ textDecoration: 'none' }}>
                  Maintenance Log
                </Link>
              </>
            )}

            {role === 'SAFETY_OFFICER' && (
              <Link to="/safety/drivers" className="auth-button" style={{ textDecoration: 'none' }}>
                Manage Drivers
              </Link>
            )}

            {role === 'DISPATCHER' && (
              <Link to="/dispatcher/trips" className="auth-button" style={{ textDecoration: 'none' }}>
                Manage Trips
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage