import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../Components/AppLayout'
import { getVehicles } from '../services/vehicleService'
import {
  createMaintenance,
  getMaintenanceRecords,
  completeMaintenance,
  getMaintenanceStatusLabel,
  getVehicleStatusLabel,
} from '../services/maintenanceService'
import '../Styles/vehicles.css'

const EMPTY_FORM = {
  vehicleId: '',
  description: '',
  startDate: '',
  estimatedEndDate: '',
  estimatedCost: '',
}

function FleetMaintenancePage() {
  const { user } = useAuth()

  const [form, setForm] = useState(EMPTY_FORM)
  const [vehicles, setVehicles] = useState([])
  const [records, setRecords] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function loadPageData() {
    setIsLoading(true)
    try {
      const [vehicleData, maintenanceData] = await Promise.all([
        getVehicles(),
        getMaintenanceRecords(),
      ])
      setVehicles(vehicleData)
      setRecords(maintenanceData)
    } catch (error) {
      setFormError(error.message || 'Failed to load maintenance data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPageData()
  }, [])

  const selectableVehicles = vehicles.filter(
    (vehicle) => vehicle.status !== 'IN_SHOP' && vehicle.status !== 'RETIRED'
  )

  function validate() {
    const newErrors = {}

    if (!form.vehicleId) newErrors.vehicleId = 'Select a vehicle'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.startDate) newErrors.startDate = 'Start date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleAddMaintenance(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await createMaintenance(form)
      setForm(EMPTY_FORM)
      setErrors({})
      await loadPageData()
    } catch (error) {
      setFormError(error.message || 'Failed to add maintenance record')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleComplete(recordId) {
    setFormError('')
    try {
      await completeMaintenance(recordId)
      await loadPageData()
    } catch (error) {
      setFormError(error.message || 'Failed to complete maintenance')
    }
  }

  return (
    <AppLayout
      title="Fleet Manager — Maintenance Log"
      subtitle={`Logged in as ${user?.fullName || user?.email}`}
    >
      <div className="vehicles-container">
        <div className="vehicles-card">
          <h2>Add to Maintenance Log</h2>
          <p className="auth-subtitle">
            Adding a vehicle here automatically marks it as In Shop (Under Maintenance).
          </p>
          {formError && <div className="form-error">{formError}</div>}

          <form className="auth-form" onSubmit={handleAddMaintenance} noValidate>
            <div className="vehicles-grid">
              <div className="form-group">
                <label htmlFor="vehicleId">Vehicle</label>
                <select
                  id="vehicleId"
                  value={form.vehicleId}
                  onChange={(e) => updateField('vehicleId', e.target.value)}
                  className={errors.vehicleId ? 'input-error' : ''}
                >
                  <option value="">Select vehicle</option>
                  {selectableVehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNo} — {vehicle.name} (
                      {getVehicleStatusLabel(vehicle.status)})
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <span className="field-error">{errors.vehicleId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className={errors.startDate ? 'input-error' : ''}
                />
                {errors.startDate && (
                  <span className="field-error">{errors.startDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="estimatedEndDate">Estimated End Date</label>
                <input
                  id="estimatedEndDate"
                  type="date"
                  value={form.estimatedEndDate}
                  onChange={(e) => updateField('estimatedEndDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estimatedCost">Estimated Cost</label>
                <input
                  id="estimatedCost"
                  type="number"
                  value={form.estimatedCost}
                  onChange={(e) => updateField('estimatedCost', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="3"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && (
                <span className="field-error">{errors.description}</span>
              )}
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add to Maintenance Log'}
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Maintenance Records</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : records.length === 0 ? (
            <p>No maintenance records yet.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Description</th>
                    <th>Start</th>
                    <th>Est. End</th>
                    <th>Cost</th>
                    <th>Maintenance Status</th>
                    <th>Vehicle Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>
                        {record.vehicleRegistrationNo} — {record.vehicleName}
                      </td>
                      <td>{record.description}</td>
                      <td>{record.startDate}</td>
                      <td>{record.estimatedEndDate || '-'}</td>
                      <td>{record.estimatedCost ?? '-'}</td>
                      <td>{getMaintenanceStatusLabel(record.status)}</td>
                      <td>{getVehicleStatusLabel(record.vehicleStatus)}</td>
                      <td>
                        {record.status === 'OPEN' ? (
                          <button
                            type="button"
                            className="auth-button"
                            onClick={() => handleComplete(record.id)}
                          >
                            Mark Ready to Dispatch
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
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

export default FleetMaintenancePage