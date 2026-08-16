import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import AppLayout from '../Components/AppLayout'
import { getVehicles } from '../services/vehicleService'
import { createFuelLog, getFuelLogs } from '../services/fuelServices'
import {
  createExpense,
  getExpenses,
  completeExpense,
  getExpenseStatusLabel,
} from '../services/expenseService'
import {
  getFinanceSummary,
  computeVehicleOperationalCosts,
} from '../services/financeService'
import '../Styles/vehicles.css'

const EMPTY_FUEL_FORM = {
  vehicleId: '',
  logDate: '',
  liters: '',
  fuelCost: '',
}

const EMPTY_EXPENSE_FORM = {
  vehicleId: '',
  tollFee: '',
  otherFee: '',
}

function FinancialCostsPage() {
  const { user } = useAuth()
  const { formatCurrency, currencyCode } = useSettings()

  const [vehicles, setVehicles] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [vehicleCosts, setVehicleCosts] = useState([])

  const [fuelForm, setFuelForm] = useState(EMPTY_FUEL_FORM)
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE_FORM)

  const [fuelErrors, setFuelErrors] = useState({})
  const [expenseErrors, setExpenseErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingFuel, setIsSavingFuel] = useState(false)
  const [isSavingExpense, setIsSavingExpense] = useState(false)

  function updateFuelField(name, value) {
    setFuelForm((prev) => ({ ...prev, [name]: value }))
  }

  function updateExpenseField(name, value) {
    setExpenseForm((prev) => ({ ...prev, [name]: value }))
  }

  async function loadPageData() {
    setIsLoading(true)
    setFormError('')

    try {
      const [vehicleData, fuelData, expenseData, summaryData] = await Promise.all([
        getVehicles(),
        getFuelLogs(),
        getExpenses(),
        getFinanceSummary(),
      ])

      setVehicles(vehicleData)
      setFuelLogs(fuelData)
      setExpenses(expenseData)
      setSummary(summaryData)
      setVehicleCosts(
        computeVehicleOperationalCosts(vehicleData, fuelData, expenseData)
      )
    } catch (error) {
      setFormError(error.message || 'Failed to load finance data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPageData()
  }, [])

  function validateFuelForm() {
    const newErrors = {}

    if (!fuelForm.vehicleId) newErrors.vehicleId = 'Select a vehicle'
    if (!fuelForm.logDate) newErrors.logDate = 'Date is required'
    if (!fuelForm.liters || Number(fuelForm.liters) <= 0) {
      newErrors.liters = 'Enter valid liters'
    }
    if (!fuelForm.fuelCost || Number(fuelForm.fuelCost) <= 0) {
      newErrors.fuelCost = 'Enter valid fuel cost'
    }

    setFuelErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function validateExpenseForm() {
    const newErrors = {}

    if (!expenseForm.vehicleId) newErrors.vehicleId = 'Select a vehicle'

    const toll = Number(expenseForm.tollFee || 0)
    const other = Number(expenseForm.otherFee || 0)

    if (toll <= 0 && other <= 0) {
      newErrors.tollFee = 'Enter toll fee or other fee (at least one > 0)'
    }

    setExpenseErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleAddFuelLog(event) {
    event.preventDefault()
    setFormError('')
    if (!validateFuelForm()) return

    setIsSavingFuel(true)
    try {
      await createFuelLog(fuelForm)
      setFuelForm(EMPTY_FUEL_FORM)
      setFuelErrors({})
      await loadPageData()
    } catch (error) {
      setFormError(error.message || 'Failed to add fuel log')
    } finally {
      setIsSavingFuel(false)
    }
  }

  async function handleAddExpense(event) {
    event.preventDefault()
    setFormError('')
    if (!validateExpenseForm()) return

    setIsSavingExpense(true)
    try {
      await createExpense(expenseForm)
      setExpenseForm(EMPTY_EXPENSE_FORM)
      setExpenseErrors({})
      await loadPageData()
    } catch (error) {
      setFormError(error.message || 'Failed to add expense')
    } finally {
      setIsSavingExpense(false)
    }
  }

  async function handleCompleteExpense(expenseId) {
    setFormError('')
    try {
      await completeExpense(expenseId)
      await loadPageData()
    } catch (error) {
      setFormError(error.message || 'Failed to complete expense')
    }
  }

  return (
    <AppLayout
      title="Financial Analyst — Costs"
      subtitle={`Logged in as ${user?.fullName || user?.email}`}
    >
      <div className="vehicles-container">
        {formError && <div className="form-error">{formError}</div>}

        <div className="vehicles-card">
          <h2>Fleet Cost Summary</h2>
          {isLoading || !summary ? (
            <p>Loading summary...</p>
          ) : (
            <div className="vehicles-grid">
              <div className="form-group">
                <strong>Total Fuel Cost</strong>
                <p>{formatCurrency(summary.totalFuelCost)}</p>
              </div>
              <div className="form-group">
                <strong>Total Maintenance Cost</strong>
                <p>{formatCurrency(summary.totalMaintenanceCost)}</p>
              </div>
              <div className="form-group">
                <strong>Total Toll Fees</strong>
                <p>{formatCurrency(summary.totalTollFees)}</p>
              </div>
              <div className="form-group">
                <strong>Total Other Fees</strong>
                <p>{formatCurrency(summary.totalOtherFees)}</p>
              </div>
              <div className="form-group full-width">
                <strong>Total Operational Cost (All)</strong>
                <p>{formatCurrency(summary.totalOperationalCost)}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            className="auth-button"
            onClick={loadPageData}
            style={{ marginTop: '12px' }}
          >
            Refresh
          </button>
        </div>

        <div className="vehicles-card">
          <h2>Operational Cost Per Vehicle (Fuel + Maintenance)</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Vehicle</th>
                    <th>Fuel Cost ({currencyCode})</th>
                    <th>Maintenance Cost ({currencyCode})</th>
                    <th>Total Operational Cost ({currencyCode})</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleCosts.map((row) => (
                    <tr key={row.vehicleId}>
                      <td>{row.registrationNo}</td>
                      <td>{row.name}</td>
                      <td>{formatCurrency(row.fuelCost)}</td>
                      <td>{formatCurrency(row.maintenanceCost)}</td>
                      <td>{formatCurrency(row.totalOperationalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="vehicles-card">
          <h2>Record Fuel Log</h2>
          <form className="auth-form" onSubmit={handleAddFuelLog} noValidate>
            <div className="vehicles-grid">
              <div className="form-group">
                <label htmlFor="fuelVehicleId">Vehicle</label>
                <select
                  id="fuelVehicleId"
                  value={fuelForm.vehicleId}
                  onChange={(e) => updateFuelField('vehicleId', e.target.value)}
                  className={fuelErrors.vehicleId ? 'input-error' : ''}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNo} — {vehicle.name}
                    </option>
                  ))}
                </select>
                {fuelErrors.vehicleId && (
                  <span className="field-error">{fuelErrors.vehicleId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="logDate">Date</label>
                <input
                  id="logDate"
                  type="date"
                  value={fuelForm.logDate}
                  onChange={(e) => updateFuelField('logDate', e.target.value)}
                  className={fuelErrors.logDate ? 'input-error' : ''}
                />
                {fuelErrors.logDate && (
                  <span className="field-error">{fuelErrors.logDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="liters">Liters</label>
                <input
                  id="liters"
                  type="number"
                  value={fuelForm.liters}
                  onChange={(e) => updateFuelField('liters', e.target.value)}
                  className={fuelErrors.liters ? 'input-error' : ''}
                />
                {fuelErrors.liters && (
                  <span className="field-error">{fuelErrors.liters}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="fuelCost">Fuel Cost ({currencyCode})</label>
                <input
                  id="fuelCost"
                  type="number"
                  value={fuelForm.fuelCost}
                  onChange={(e) => updateFuelField('fuelCost', e.target.value)}
                  className={fuelErrors.fuelCost ? 'input-error' : ''}
                />
                {fuelErrors.fuelCost && (
                  <span className="field-error">{fuelErrors.fuelCost}</span>
                )}
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={isSavingFuel}>
              {isSavingFuel ? 'Saving...' : 'Add Fuel Log'}
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Record Other Expense (Tolls / Other)</h2>
          <p className="auth-subtitle">
            Maintenance costs are added automatically when Fleet Manager logs maintenance.
          </p>

          <form className="auth-form" onSubmit={handleAddExpense} noValidate>
            <div className="vehicles-grid">
              <div className="form-group">
                <label htmlFor="expenseVehicleId">Vehicle</label>
                <select
                  id="expenseVehicleId"
                  value={expenseForm.vehicleId}
                  onChange={(e) => updateExpenseField('vehicleId', e.target.value)}
                  className={expenseErrors.vehicleId ? 'input-error' : ''}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNo} — {vehicle.name}
                    </option>
                  ))}
                </select>
                {expenseErrors.vehicleId && (
                  <span className="field-error">{expenseErrors.vehicleId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tollFee">Toll Fee ({currencyCode})</label>
                <input
                  id="tollFee"
                  type="number"
                  value={expenseForm.tollFee}
                  onChange={(e) => updateExpenseField('tollFee', e.target.value)}
                  className={expenseErrors.tollFee ? 'input-error' : ''}
                />
                {expenseErrors.tollFee && (
                  <span className="field-error">{expenseErrors.tollFee}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="otherFee">Other Fee ({currencyCode})</label>
                <input
                  id="otherFee"
                  type="number"
                  value={expenseForm.otherFee}
                  onChange={(e) => updateExpenseField('otherFee', e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={isSavingExpense}>
              {isSavingExpense ? 'Saving...' : 'Add Expense'}
            </button>
          </form>
        </div>

        <div className="vehicles-card">
          <h2>Fuel Logs</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : fuelLogs.length === 0 ? (
            <p>No fuel logs yet.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Date</th>
                    <th>Liters</th>
                    <th>Cost ({currencyCode})</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        {log.vehicleRegistrationNo} — {log.vehicleName}
                      </td>
                      <td>{log.logDate}</td>
                      <td>{log.liters}</td>
                      <td>{formatCurrency(log.fuelCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="vehicles-card">
          <h2>All Expenses</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : expenses.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Toll ({currencyCode})</th>
                    <th>Other ({currencyCode})</th>
                    <th>Maintenance ({currencyCode})</th>
                    <th>Total ({currencyCode})</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.vehicleRegistrationNo}</td>
                      <td>{formatCurrency(expense.tollFee)}</td>
                      <td>{formatCurrency(expense.otherFee)}</td>
                      <td>{formatCurrency(expense.maintenanceLinkedCost)}</td>
                      <td>{formatCurrency(expense.total)}</td>
                      <td>
                        {expense.autoGeneratedFromMaintenance
                          ? 'Auto (Maintenance)'
                          : 'Manual'}
                      </td>
                      <td>{getExpenseStatusLabel(expense.status)}</td>
                      <td>
                        {expense.status === 'AVAILABLE' ? (
                          <button
                            type="button"
                            className="auth-button"
                            onClick={() => handleCompleteExpense(expense.id)}
                          >
                            Mark Completed
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

export default FinancialCostsPage