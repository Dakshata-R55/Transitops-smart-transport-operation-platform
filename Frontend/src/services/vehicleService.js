import { authFetch } from './apiClient'

// Convert backend response → format your FleetVehiclesPage expects
function mapVehicleFromApi(vehicle) {
  return {
    id: vehicle.id,
    registrationNo: vehicle.registrationNumber,
    name: vehicle.nameModel,
    type: vehicle.type,
    capacity: vehicle.maxLoadCapacityKg,
    odometer: vehicle.odometer,
    acqCost: vehicle.acquisitionCost,
    status: vehicle.status,
  }
}

// Convert your form data → backend create request
function mapVehicleToApi(vehicleData) {
  return {
    registrationNumber: vehicleData.registrationNo,
    nameModel: vehicleData.name,
    type: vehicleData.type,
    maxLoadCapacityKg: Number(vehicleData.capacity),
    odometer: Number(vehicleData.odometer),
    acquisitionCost: Number(vehicleData.acqCost),
    status: vehicleData.status,
  }
}

export async function createVehicle(vehicleData) {
  const response = await authFetch('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify(mapVehicleToApi(vehicleData)),
  })

  return mapVehicleFromApi(response)
}

export async function getVehicles(filters = {}) {
  const vehicles = await authFetch('/api/vehicles')

  const mapped = vehicles.map(mapVehicleFromApi)

  return mapped.filter((vehicle) => {
    const typeMatch = !filters.type || vehicle.type === filters.type
    const statusMatch = !filters.status || vehicle.status === filters.status
    return typeMatch && statusMatch
  })
}

export async function getAvailableVehicles() {
  const vehicles = await getVehicles()
  return vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE')
}