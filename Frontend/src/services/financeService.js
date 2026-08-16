import { authFetch } from './apiClient'

export async function getFinanceSummary() {
  return authFetch('/api/finance/summary')
}

export function computeVehicleOperationalCosts(vehicles, fuelLogs, expenses) {
  const costMap = {}

  vehicles.forEach((vehicle) => {
    costMap[vehicle.id] = {
      vehicleId: vehicle.id,
      registrationNo: vehicle.registrationNo,
      name: vehicle.name,
      fuelCost: 0,
      maintenanceCost: 0,
      totalOperationalCost: 0,
    }
  })

  fuelLogs.forEach((log) => {
    if (!costMap[log.vehicleId]) return
    costMap[log.vehicleId].fuelCost += Number(log.fuelCost || 0)
  })

  expenses.forEach((expense) => {
    if (!costMap[expense.vehicleId]) return
    costMap[expense.vehicleId].maintenanceCost += Number(
      expense.maintenanceLinkedCost || 0
    )
  })

  return Object.values(costMap).map((row) => ({
    ...row,
    totalOperationalCost: row.fuelCost + row.maintenanceCost,
  }))
}

export function formatMoney(value) {
  const number = Number(value || 0)
  return number.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}