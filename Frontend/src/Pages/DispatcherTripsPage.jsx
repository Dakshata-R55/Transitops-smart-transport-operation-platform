import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAvailableVehicles } from '../services/vehicleService'
import { getAvailableDrivers } from '../services/driverService'
import {
  createTrip,
  getTrips,
  updateTripStatus,
  TRIP_STATUSES,
} from '../services/tripService'
import '../Styles/vehicles.css'

const EMPTY_FORM = {
  source: '',
  destination: '',
  vehicleId: '',
  driverId: '',
  cargoWeight: '',
  plannedDistance: '',
}

function DispatcherTripsPage() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trips, setTrips] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function loadPageData(currentStatusFilter = statusFilter) {
    setIsLoading(true)
    try {
      const [vehicleList, driverList, tripList] = await Promise.all([
        getAvailableVehicles(),
        getAvailableDrivers(),
        getTrips(currentStatusFilter ? { status: currentStatusFilter } : {}),
      ])
      setVehicles(vehicleList)
      setDrivers(driverList)
      setTrips(tripList)
    } catch (error) {
      setFormError(error.message || 'Failed to load trip data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPageData()
  }, [])

  function validate() {
    const newErrors = {}

    if (!form.source.trim()) newErrors.source = 'Source is required'
    if (!form.destination.trim()) newErrors.destination = 'Destination is required'
    if (!form.vehicleId) newErrors.vehicleId = 'Select an available vehicle'
    if (!form.driverId) newErrors.driverId = 'Select an available driver'
    if (!form.cargoWeight || Number(form.cargoWeight) <= 0) {
      newErrors.cargoWeight = 'Enter valid cargo weight (kg)'
    }
    if (!form.plannedDistance || Number(form.plannedDistance) <= 0) {
      newErrors.plannedDistance = 'Enter valid planned distance (km)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleCreateTrip(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await createTrip({
        source: form.source.trim(),
        destination: form.destination.trim(),
        vehicleId: form.vehicleId,
        driverId: form.driverId,
        cargoWeight: form.cargoWeight,
        plannedDistance: form.plannedDistance,
      })
      setForm(EMPTY_FORM)
      setErrors({})
      await loadPageData(statusFilter)
    } catch (error) {
      setFormError(error.message || 'Failed to create trip')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleStatusChange(tripId, nextStatus) {
    setFormError('')
    try {
      await updateTripStatus(tripId, nextStatus)
      await loadPageData(statusFilter)
    } catch (error) {
      setFormError(error.message || 'Failed to update trip status')
    }
  }

  async function handleApplyFilter(event) {
    event.preventDefault()
    await loadPageData(statusFilter)
  }

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  function getVehicleLabel(vehicleId) {
    const vehicle = vehicles.find((v) => v.id === vehicleId)
    if (vehicle) return `${vehicle.registrationNo} — ${vehicle.name}`
    return `Vehicle #${vehicleId}`
  }

  function getDriverLabel(driverId) {
    const driver = drivers.find((d) => d.id === driverId)
    if (driver) return driver.fullName
    return `Driver #${driverId}`
  }

  function renderStatusActions(trip) {
    if (trip.status === 'DRAFT') {
      return (
        <>
          <button
            type="button"
            className="auth-button"
            onClick={() => handleStatusChange(trip.id, 'DISPATCHED')}
          >
            Dispatch
          </button>
          <button
            type="button"
            className="auth-button"
            onClick={() => handleStatusChange(trip.id, 'CANCELLED')}
          >
            Cancel
          </button>
        </>
      )
    }

    if (trip.status === 'DISPATCHED') {
      return (
        <>
          <button
            type="button"
            className="auth-button"
            onClick={() => handleStatusChange(trip.id, 'COMPLETED')}
          >
            Complete
          </button>
          <button
            type="button"
            className="auth-button"
            onClick={() => handleStatusChange(trip.id, 'CANCELLED')}
          >
            Cancel
          </button>
        </>
      )
    }

    return <span>—</span>
  }

  return (
    <div className="vehicles-page">
      <div className="vehicles-container">
        <div className="vehicles-header">
          <div>
            <h1>Dispatcher — Trips</h1>
            <p className="auth-subtitle">
              Logged in as {user?.fullName || user?.email}
            </p>
          </div>
          <button type="button" className="auth-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="vehicles-card">
          <h2>Create Trip</h2>
          <p className="auth-subtitle">New trips start as DRAFT</p>
          {formError && <div className="form-error">{formError}</div>}

          <form className="auth-form" onSubmit={handleCreateTrip} noValidate>
            <div className="vehicles-grid">
              <div className="form-group">
                <label htmlFor="source">Source</label>
                <input
                  id="source"
                  value={form.source}
                  onChange={(e) => updateField('source', e.target.value)}
                  placeholder="Mumbai Depot"
                  className={errors.source ? 'input-error' : ''}
                />
                {errors.source && <span className="field-error">{errors.source}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="destination">Destination</label>
                <input
                  id="destination"
                  value={form.destination}
                  onChange={(e) => updateField('destination', e.target.value)}
                  placeholder="Pune Hub"
                  className={errors.destination ? 'input-error' : ''}
                />
                {errors.destination && (
                  <span className="field-error">{errors.destination}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="vehicleId">Available Vehicle</label>
                <select
                  id="vehicleId"
                  value={form.vehicleId}
                  onChange={(e) => updateField('vehicleId', e.target.value)}
                  className={errors.vehicleId ? 'input-error' : ''}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNo} — {vehicle.name} ({vehicle.type})
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <span className="field-error">{errors.vehicleId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="driverId">Available Driver</label>
                <select
                  id="driverId"
                  value={form.driverId}
                  onChange={(e) => updateField('driverId', e.target.value)}
                  className={errors.driverId ? 'input-error' : ''}
                >
                  <option value="">Select driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.fullName} — {driver.licenseNumber}
                    </option>
                  ))}
                </select>
                {errors.driverId && (
                  <span className="field-error">{errors.driverId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cargoWeight">Cargo Weight (kg)</label>
                <input
                  id="cargoWeight"
                  type="number"
                  value={form.cargoWeight}
                  onChange={(e) => updateField('cargoWeight', e.target.value)}
                  className={errors.cargoWeight ? 'input-error' : ''}
                />
                {errors.cargoWeight && (
                  <span className="field-error">{errors.cargoWeight}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="plannedDistance">Planned Distance (km)</label>
                <input
                  id="plannedDistance"
                  type="number"
                  value={form.plannedDistance}
                  onChange={(e) => updateField('plannedDistance', e.target.value)}
                  className={errors.plannedDistance ? 'input-error' : ''}
                />
                {errors.plannedDistance && (
                  <span className="field-error">{errors.plannedDistance}</span>
                )}
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Trip (Draft)'}
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Filter Trips</h2>
          <form className="filter-row" onSubmit={handleApplyFilter}>
            <div className="form-group">
              <label htmlFor="statusFilter">Trip Status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {TRIP_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="auth-button">
              Apply Filter
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Trip List</h2>
          {isLoading ? (
            <p>Loading trips...</p>
          ) : trips.length === 0 ? (
            <p>No trips found.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Weight (kg)</th>
                    <th>Distance (km)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.id}</td>
                      <td>{trip.source}</td>
                      <td>{trip.destination}</td>
                      <td>{getVehicleLabel(trip.vehicleId)}</td>
                      <td>{getDriverLabel(trip.driverId)}</td>
                      <td>{trip.cargoWeight}</td>
                      <td>{trip.plannedDistance}</td>
                      <td>{trip.status}</td>
                      <td>{renderStatusActions(trip)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DispatcherTripsPage