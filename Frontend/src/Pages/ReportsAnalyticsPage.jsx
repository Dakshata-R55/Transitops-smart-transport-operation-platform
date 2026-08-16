import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import AppLayout from '../Components/AppLayout'
import BarChartCard from '../Components/BarChartCard'
import { getReportsAnalytics, formatMonthLabel } from '../services/reportsService'
import '../Styles/dashboard.css'
import '../Styles/vehicles.css'

function ReportsAnalyticsPage() {
  const { user } = useAuth()
  const { formatCurrency, currencyCode } = useSettings()

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

  const monthlyRevenueChartData = (report?.monthlyRevenue || []).map((item) => ({
    name: formatMonthLabel(item.month),
    value: item.revenue,
  }))

  const topCostChartData = (report?.topCostliestVehicles || []).map((vehicle) => ({
    name: vehicle.registrationNumber,
    value: vehicle.totalCost,
  }))

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
              {isLoading ? '...' : formatCurrency(report?.operationalCost)}
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-label">Vehicle ROI</div>
            <div className={`kpi-value ${!isLoading ? 'percent' : ''}`}>
              {isLoading ? '...' : report?.vehicleRoiPercent ?? 0}
            </div>
          </div>
        </div>

        {!isLoading && (
          <div className="charts-grid">
            <BarChartCard
              title="Monthly Revenue"
              data={monthlyRevenueChartData}
              dataKey="value"
              barColor="#2563eb"
              valueFormatter={(value) => formatCurrency(value)}
            />

            <BarChartCard
              title="Top Costliest Vehicles"
              data={topCostChartData}
              dataKey="value"
              barColor="#dc2626"
              valueFormatter={(value) => formatCurrency(value)}
            />
          </div>
        )}

        <div className="vehicles-card">
          <h2>Monthly Revenue Details</h2>
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
                    <th>Revenue ({currencyCode})</th>
                  </tr>
                </thead>
                <tbody>
                  {report.monthlyRevenue.map((item) => (
                    <tr key={item.month}>
                      <td>{formatMonthLabel(item.month)}</td>
                      <td>{formatCurrency(item.revenue)}</td>
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
                    <th>Total Cost ({currencyCode})</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topCostliestVehicles.map((vehicle) => (
                    <tr key={vehicle.vehicleId}>
                      <td>{vehicle.registrationNumber}</td>
                      <td>{vehicle.nameModel}</td>
                      <td>{formatCurrency(vehicle.totalCost)}</td>
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