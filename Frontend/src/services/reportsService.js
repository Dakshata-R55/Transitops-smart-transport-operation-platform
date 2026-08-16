import { authFetch } from './apiClient'

function mapReportsFromApi(data) {
  return {
    fuelEfficiencyKmPerLiter: Number(data.fuelEfficiencyKmPerLiter || 0),
    fleetUtilizationPercent: Number(data.fleetUtilizationPercent || 0),
    operationalCost: Number(data.operationalCost || 0),
    vehicleRoiPercent: Number(data.vehicleRoiPercent || 0),
    monthlyRevenue: (data.monthlyRevenue || []).map((item) => ({
      month: item.month,
      revenue: Number(item.revenue || 0),
    })),
    topCostliestVehicles: (data.topCostliestVehicles || []).map((item) => ({
      vehicleId: item.vehicleId,
      registrationNumber: item.registrationNumber,
      nameModel: item.nameModel,
      totalCost: Number(item.totalCost || 0),
    })),
  }
}

export async function getReportsAnalytics() {
  const data = await authFetch('/api/reports/analytics')
  return mapReportsFromApi(data)
}

export function formatMonthLabel(monthValue) {
  if (!monthValue) return '-'

  const [year, month] = monthValue.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  })
}