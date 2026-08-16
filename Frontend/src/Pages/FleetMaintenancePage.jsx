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
import { SERVICE_TYPES, getServiceTypeLabel } from '../config/maintenanceTypes'
import '../Styles/vehicles.css'

const EMPTY_FORM = {
  vehicleId: '',
  serviceType: '',
  serviceDate: '',
  cost: '',
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
    if (!form.serviceType) newErrors.serviceType = 'Select maintenance type'
    if (!form.serviceDate) newErrors.serviceDate = 'Service date is required'
    if (!form.cost || Number(form.cost) <= 0) {
      newErrors.cost = 'Enter a valid cost greater than 0'
    }

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
            Select which maintenance the vehicle was taken for. Vehicle status becomes In Shop automatically.
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
                <label htmlFor="serviceType">Maintenance Type</label>
                <select
                  id="serviceType"
                  value={form.serviceType}
                  onChange={(e) => updateField('serviceType', e.target.value)}
                  className={errors.serviceType ? 'input-error' : ''}
                >
                  <option value="">Select maintenance type</option>
                  {SERVICE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <span className="field-error">{errors.serviceType}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="serviceDate">Service Date</label>
                <input
                  id="serviceDate"
                  type="date"
                  value={form.serviceDate}
                  onChange={(e) => updateField('serviceDate', e.target.value)}
                  className={errors.serviceDate ? 'input-error' : ''}
                />
                {errors.serviceDate && (
                  <span className="field-error">{errors.serviceDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cost">Maintenance Cost (₹)</label>
                <input
                  id="cost"
                  type="number"
                  value={form.cost}
                  onChange={(e) => updateField('cost', e.target.value)}
                  className={errors.cost ? 'input-error' : ''}
                />
                {errors.cost && (
                  <span className="field-error">{errors.cost}</span>
                )}
              </div>
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
                    <th>Maintenance Type</th>
                    <th>Service Date</th>
                    <th>Cost (₹)</th>
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
                      <td>{getServiceTypeLabel(record.serviceType)}</td>
                      <td>{record.serviceDate}</td>
                      <td>{record.cost}</td>
                      <td>{getMaintenanceStatusLabel(record.status)}</td>
                      <td>{getVehicleStatusLabel(record.vehicleStatus)}</td>
                      <td>
                        {record.status === 'IN_SHOP' ? (
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