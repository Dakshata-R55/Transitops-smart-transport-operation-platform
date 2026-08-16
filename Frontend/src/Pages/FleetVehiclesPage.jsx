import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../Components/AppLayout'
import { createVehicle, getVehicles } from '../services/vehicleService'
import { getVehicleStatusLabel } from '../services/maintenanceService'
import '../Styles/vehicles.css'

const VEHICLE_TYPES = ['BUS', 'TRUCK', 'VAN', 'MINI_BUS']
const VEHICLE_STATUSES = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP']

const EMPTY_FORM = {
  registrationNo: '',
  name: '',
  type: 'BUS',
  capacity: '',
  odometer: '',
  acqCost: '',
  status: 'AVAILABLE',
}

function FleetVehiclesPage() {
  const { user } = useAuth()

  const [form, setForm] = useState(EMPTY_FORM)
  const [filters, setFilters] = useState({ type: '', status: '' })
  const [vehicles, setVehicles] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function loadVehicles(currentFilters = filters) {
    setIsLoading(true)
    try {
      const data = await getVehicles(currentFilters)
      setVehicles(data)
    } catch (error) {
      setFormError(error.message || 'Failed to load vehicles')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  function validate() {
    const newErrors = {}

    if (!form.registrationNo.trim()) {
      newErrors.registrationNo = 'Registration number is required'
    }
    if (!form.name.trim()) {
      newErrors.name = 'Vehicle name is required'
    }
    if (!form.capacity || Number(form.capacity) <= 0) {
      newErrors.capacity = 'Enter a valid capacity'
    }
    if (!form.odometer || Number(form.odometer) < 0) {
      newErrors.odometer = 'Enter a valid odometer reading'
    }
    if (!form.acqCost || Number(form.acqCost) <= 0) {
      newErrors.acqCost = 'Enter a valid acquisition cost'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleAddVehicle(event) {
    event.preventDefault()
    setFormError('')

    if (!validate()) return

    setIsSubmitting(true)

    try {
      await createVehicle({
        registrationNo: form.registrationNo.trim(),
        name: form.name.trim(),
        type: form.type,
        capacity: Number(form.capacity),
        odometer: Number(form.odometer),
        acqCost: Number(form.acqCost),
        status: form.status,
      })

      setForm(EMPTY_FORM)
      setErrors({})
      await loadVehicles(filters)
    } catch (error) {
      setFormError(error.message || 'Failed to add vehicle')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleApplyFilters(event) {
    event.preventDefault()
    await loadVehicles(filters)
  }

  return (
    <AppLayout
      title="Fleet Manager — Vehicles"
      subtitle={`Logged in as ${user?.fullName || user?.email}`}
    >
      <div className="vehicles-container">
        <div className="vehicles-card">
          <h2>Add Vehicle</h2>
          {formError && <div className="form-error">{formError}</div>}

          <form className="auth-form" onSubmit={handleAddVehicle} noValidate>
            <div className="vehicles-grid">
              <div className="form-group">
                <label htmlFor="registrationNo">Registration No</label>
                <input
                  id="registrationNo"
                  value={form.registrationNo}
                  onChange={(e) => updateField('registrationNo', e.target.value)}
                  className={errors.registrationNo ? 'input-error' : ''}
                />
                {errors.registrationNo && (
                  <span className="field-error">{errors.registrationNo}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => updateField('type', e.target.value)}
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  {VEHICLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {getVehicleStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  id="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={(e) => updateField('capacity', e.target.value)}
                  className={errors.capacity ? 'input-error' : ''}
                />
                {errors.capacity && (
                  <span className="field-error">{errors.capacity}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="odometer">Odometer</label>
                <input
                  id="odometer"
                  type="number"
                  value={form.odometer}
                  onChange={(e) => updateField('odometer', e.target.value)}
                  className={errors.odometer ? 'input-error' : ''}
                />
                {errors.odometer && (
                  <span className="field-error">{errors.odometer}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="acqCost">ACQ Cost</label>
                <input
                  id="acqCost"
                  type="number"
                  value={form.acqCost}
                  onChange={(e) => updateField('acqCost', e.target.value)}
                  className={errors.acqCost ? 'input-error' : ''}
                />
                {errors.acqCost && (
                  <span className="field-error">{errors.acqCost}</span>
                )}
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Filter Vehicles</h2>
          <form className="filter-row" onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label htmlFor="filterType">Type</label>
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
              <label htmlFor="filterStatus">Status</label>
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

            <button type="submit" className="auth-button">
              Apply Filter
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Vehicle List</h2>
          {isLoading ? (
            <p>Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <p>No vehicles found.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Odometer</th>
                    <th>ACQ Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.registrationNo}</td>
                      <td>{vehicle.name}</td>
                      <td>{vehicle.type}</td>
                      <td>{vehicle.capacity}</td>
                      <td>{vehicle.odometer}</td>
                      <td>{vehicle.acqCost}</td>
                      <td>{getVehicleStatusLabel(vehicle.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default FleetVehiclesPage