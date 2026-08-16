import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../Components/AppLayout'
import BarChartCard from '../Components/BarChartCard'
import {
  fetchDashboardKpis,
  VEHICLE_TYPES,
  VEHICLE_STATUSES,
  REGIONS,
} from '../services/dashboardService'
import { getVehicleStatusLabel } from '../services/maintenanceService'
import '../Styles/dashboard.css'
import '../Styles/vehicles.css'

const EMPTY_FILTERS = {
  type: '',
  status: '',
  region: '',
}

const EMPTY_KPIS = {
  activeVehicles: 0,
  availableVehicles: 0,
  vehiclesInMaintenance: 0,
  activeTrips: 0,
  pendingTrips: 0,
  driversOnDuty: 0,
  fleetUtilization: 0,
}

function DashboardPage() {
  const { user } = useAuth()

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [kpis, setKpis] = useState(EMPTY_KPIS)
  const [pageError, setPageError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadDashboardData(currentFilters = filters) {
    setIsLoading(true)
    setPageError('')

    try {
      const data = await fetchDashboardKpis(currentFilters)
      setKpis(data)
    } catch (error) {
      setPageError(error.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData(EMPTY_FILTERS)
  }, [])

  const vehicleStatusChartData = [
    { name: 'Available', value: kpis.availableVehicles },
    { name: 'On Trip', value: kpis.activeTrips },
    { name: 'Maintenance', value: kpis.vehiclesInMaintenance },
    { name: 'Active Fleet', value: kpis.activeVehicles },
  ]

  const tripStatusChartData = [
    { name: 'Active Trips', value: kpis.activeTrips },
    { name: 'Pending Trips', value: kpis.pendingTrips },
    { name: 'Drivers On Duty', value: kpis.driversOnDuty },
    { name: 'Utilization %', value: kpis.fleetUtilization },
  ]

  function handleApplyFilters(event) {
    event.preventDefault()
    loadDashboardData(filters)
  }

  function handleResetFilters() {
    setFilters(EMPTY_FILTERS)
    loadDashboardData(EMPTY_FILTERS)
  }

  return (
    <AppLayout
      title="Operations Dashboard"
      subtitle={`Welcome, ${user?.fullName || user?.email}`}
    >
      {pageError && <div className="form-error">{pageError}</div>}

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
                  {getVehicleStatusLabel(status)}
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
          <button
            type="button"
            className="auth-button"
            onClick={() => loadDashboardData(filters)}
          >
            Refresh
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

      {!isLoading && (
        <div className="charts-grid">
          <BarChartCard
            title="Vehicle Status Overview"
            data={vehicleStatusChartData}
            dataKey="value"
            barColor="#2563eb"
          />

          <BarChartCard
            title="Trips & Utilization"
            data={tripStatusChartData}
            dataKey="value"
            barColor="#16a34a"
          />
        </div>
      )}
    </AppLayout>
  )
}

export default DashboardPage