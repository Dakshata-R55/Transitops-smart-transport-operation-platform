import { authFetch } from './apiClient'

function mapFuelLogFromApi(log) {
  return {
    id: log.id,
    vehicleId: log.vehicleId,
    vehicleRegistrationNo: log.vehicleRegistrationNumber,
    vehicleName: log.vehicleNameModel,
    logDate: log.logDate,
    liters: log.liters,
    fuelCost: log.fuelCost,
  }
}

export async function createFuelLog(fuelData) {
  const response = await authFetch('/api/fuel-logs', {
    method: 'POST',
    body: JSON.stringify({
      vehicleId: Number(fuelData.vehicleId),
      logDate: fuelData.logDate,
      liters: Number(fuelData.liters),
      fuelCost: Number(fuelData.fuelCost),
    }),
  })

  return mapFuelLogFromApi(response)
}

export async function getFuelLogs() {
  const logs = await authFetch('/api/fuel-logs')
  return logs.map(mapFuelLogFromApi)
}