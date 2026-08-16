import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../Components/AppLayout'
import { getReportsAnalytics, formatMonthLabel } from '../services/reportsService'
import { formatMoney } from '../services/financeService'
import '../Styles/dashboard.css'
import '../Styles/vehicles.css'

function ReportsAnalyticsPage() {
  const { user } = useAuth()

  const [report, setReport] = useState(null)
  const [pageError, setPageError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  async function loadReports() {
    setIsLoading(true)
    setPageError('')

    try {
      const data = await getReportsAnalytics()
      setReport(data)
    } catch (error) {
      setPageError(error.message || 'Failed to load reports and analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return (
    <AppLayout
      title="Reports & Analytics"
      subtitle={`Logged in as ${user?.fullName || user?.email}`}
    >
      {pageError && <div className="form-error">{pageError}</div>}

      <div className="vehicles-container">
        <div className="dashboard-card">
          <button type="button" className="auth-button" onClick={loadReports}>
            Refresh Reports
          </button>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Fuel Efficiency</div>
            <div className="kpi-value">
              {isLoading ? '...' : report?.fuelEfficiencyKmPerLiter ?? 0}
            </div>
            <div className="auth-subtitle">km per liter</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Fleet Utilization</div>
            <div className={`kpi-value ${!isLoading ? 'percent' : ''}`}>
              {isLoading ? '...' : report?.fleetUtilizationPercent ?? 0}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Operational Cost</div>
            <div className="kpi-value">
              {isLoading ? '...' : `₹ ${formatMoney(report?.operationalCost)}`}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Vehicle ROI</div>
            <div className={`kpi-value ${!isLoading ? 'percent' : ''}`}>
              {isLoading ? '...' : report?.vehicleRoiPercent ?? 0}
            </div>
          </div>
        </div>

        <div className="vehicles-card">
          <h2>Monthly Revenue</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : !report?.monthlyRevenue?.length ? (
            <p>No completed trip revenue data yet.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.monthlyRevenue.map((item) => (
                    <tr key={item.month}>
                      <td>{formatMonthLabel(item.month)}</td>
                      <td>{formatMoney(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="vehicles-card">
          <h2>Top Costliest Vehicles (Fuel + Maintenance)</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : !report?.topCostliestVehicles?.length ? (
            <p>No vehicle cost data yet.</p>
          ) : (
            <div className="vehicle-table-wrap">
              <table className="vehicle-table">
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Vehicle</th>
                    <th>Total Cost (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topCostliestVehicles.map((vehicle) => (
                    <tr key={vehicle.vehicleId}>
                      <td>{vehicle.registrationNumber}</td>
                      <td>{vehicle.nameModel}</td>
                      <td>{formatMoney(vehicle.totalCost)}</td>
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

export default ReportsAnalyticsPage