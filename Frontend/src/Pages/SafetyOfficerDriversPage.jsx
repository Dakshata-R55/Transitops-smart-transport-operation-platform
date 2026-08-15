import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createDriver, getDrivers } from '../services/driverService'
import '../Styles/vehicles.css'

const LICENSE_CATEGORIES = ['LMV', 'HMV', 'PSV', 'MCWG']
const DRIVER_STATUSES = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']

const EMPTY_FORM = {
  fullName: '',
  licenseNumber: '',
  licenseCategory: 'LMV',
  licenseExpiryDate: '',
  contactNumber: '',
  safetyScore: '100',
  status: 'AVAILABLE',
}

function SafetyOfficerDriversPage() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [filters, setFilters] = useState({ status: '', licenseCategory: '' })
  const [drivers, setDrivers] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function loadDrivers(currentFilters = filters) {
    setIsLoading(true)
    try {
      const data = await getDrivers(currentFilters)
      setDrivers(data)
    } catch (error) {
      setFormError(error.message || 'Failed to load drivers')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDrivers()
  }, [])

  function validate() {
    const newErrors = {}

    if (!form.fullName.trim()) newErrors.fullName = 'Name is required'
    if (!form.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required'
    if (!form.licenseExpiryDate) newErrors.licenseExpiryDate = 'License expiry date is required'
    if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
    if (!form.safetyScore || Number(form.safetyScore) < 0 || Number(form.safetyScore) > 100) {
      newErrors.safetyScore = 'Safety score must be between 0 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleAddDriver(event) {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await createDriver({
        fullName: form.fullName.trim(),
        licenseNumber: form.licenseNumber.trim(),
        licenseCategory: form.licenseCategory,
        licenseExpiryDate: form.licenseExpiryDate,
        contactNumber: form.contactNumber.trim(),
        safetyScore: Number(form.safetyScore),
        status: form.status,
      })
      setForm(EMPTY_FORM)
      setErrors({})
      await loadDrivers(filters)
    } catch (error) {
      setFormError(error.message || 'Failed to add driver')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleApplyFilters(event) {
    event.preventDefault()
    await loadDrivers(filters)
  }

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="vehicles-page">
      <div className="vehicles-container">
        <div className="vehicles-header">
          <div>
            <h1>Safety Officer — Driver Profiles</h1>
            <p className="auth-subtitle">
              Logged in as {user?.fullName || user?.email}
            </p>
          </div>
          <button type="button" className="auth-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="vehicles-card">
          <h2>Add Driver</h2>
          {formError && <div className="form-error">{formError}</div>}

          <form className="auth-form" onSubmit={handleAddDriver} noValidate>
            <div className="vehicles-grid">
              <div className="form-group">
                <label htmlFor="fullName">Name</label>
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={errors.fullName ? 'input-error' : ''}
                />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="licenseNumber">License Number</label>
                <input
                  id="licenseNumber"
                  value={form.licenseNumber}
                  onChange={(e) => updateField('licenseNumber', e.target.value)}
                  className={errors.licenseNumber ? 'input-error' : ''}
                />
                {errors.licenseNumber && (
                  <span className="field-error">{errors.licenseNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="licenseCategory">License Category</label>
                <select
                  id="licenseCategory"
                  value={form.licenseCategory}
                  onChange={(e) => updateField('licenseCategory', e.target.value)}
                >
                  {LICENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="licenseExpiryDate">License Expiry Date</label>
                <input
                  id="licenseExpiryDate"
                  type="date"
                  value={form.licenseExpiryDate}
                  onChange={(e) => updateField('licenseExpiryDate', e.target.value)}
                  className={errors.licenseExpiryDate ? 'input-error' : ''}
                />
                {errors.licenseExpiryDate && (
                  <span className="field-error">{errors.licenseExpiryDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  id="contactNumber"
                  type="tel"
                  value={form.contactNumber}
                  onChange={(e) =>
                    updateField('contactNumber', e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  className={errors.contactNumber ? 'input-error' : ''}
                />
                {errors.contactNumber && (
                  <span className="field-error">{errors.contactNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="safetyScore">Safety Score</label>
                <input
                  id="safetyScore"
                  type="number"
                  min="0"
                  max="100"
                  value={form.safetyScore}
                  onChange={(e) => updateField('safetyScore', e.target.value)}
                  className={errors.safetyScore ? 'input-error' : ''}
                />
                {errors.safetyScore && (
                  <span className="field-error">{errors.safetyScore}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value)}
                >
                  {DRIVER_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Driver'}
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Filter Drivers</h2>
          <form className="filter-row" onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label htmlFor="filterStatus">Status</label>
              <select
                id="filterStatus"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Statuses</option>
                {DRIVER_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="filterCategory">License Category</label>
              <select
                id="filterCategory"
                value={filters.licenseCategory}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, licenseCategory: e.target.value }))
                }
              >
                <option value="">All Categories</option>
                {LICENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="auth-button">Apply Filter</button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Driver List</h2>
          {isLoading ? (
            <p>Loading drivers...</p>
          ) : drivers.length === 0 ? (
            <p>No drivers found.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>License No</th>
                    <th>Category</th>
                    <th>Expiry</th>
                    <th>Contact</th>
                    <th>Safety Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.fullName}</td>
                      <td>{driver.licenseNumber}</td>
                      <td>{driver.licenseCategory}</td>
                      <td>{driver.licenseExpiryDate}</td>
                      <td>{driver.contactNumber}</td>
                      <td>{driver.safetyScore}</td>
                      <td>{driver.status}</td>
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

export default SafetyOfficerDriversPage