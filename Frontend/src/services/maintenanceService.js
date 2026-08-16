import { authFetch } from './apiClient'

function mapMaintenanceFromApi(record) {
  return {
    id: record.id,
    vehicleId: record.vehicleId,
    vehicleRegistrationNo: record.vehicleRegistrationNumber,
    vehicleName: record.vehicleNameModel,
    vehicleStatus: record.vehicleStatus,
    description: record.description,
    startDate: record.startDate,
    estimatedEndDate: record.estimatedEndDate,
    estimatedCost: record.estimatedCost,
    status: record.status,
  }
}

export async function createMaintenance(maintenanceData) {
  const response = await authFetch('/api/maintenance', {
    method: 'POST',
    body: JSON.stringify({
      vehicleId: Number(maintenanceData.vehicleId),
      description: maintenanceData.description,
      startDate: maintenanceData.startDate,
      estimatedEndDate: maintenanceData.estimatedEndDate || null,
      estimatedCost: maintenanceData.estimatedCost
        ? Number(maintenanceData.estimatedCost)
        : null,
    }),
  })

  return mapMaintenanceFromApi(response)
}

export async function getMaintenanceRecords() {
  const records = await authFetch('/api/maintenance')
  return records.map(mapMaintenanceFromApi)
}

export async function completeMaintenance(id) {
  const response = await authFetch(`/api/maintenance/${id}/complete`, {
    method: 'PATCH',
  })

  return mapMaintenanceFromApi(response)
}

export const MAINTENANCE_STATUS_LABELS = {
    OPEN: 'In Shop (Under Maintenance)',
    COMPLETED: 'Complete (Ready to Dispatch)',
  }
  
  export const VEHICLE_STATUS_LABELS = {
    AVAILABLE: 'Available (Ready to Dispatch)',
    IN_SHOP: 'In Shop (Under Maintenance)',
    ON_TRIP: 'On Trip',
    RETIRED: 'Retired',
  }
  
  export function getMaintenanceStatusLabel(status) {
    return MAINTENANCE_STATUS_LABELS[status] || status
  }
  
  export function getVehicleStatusLabel(status) {
    return VEHICLE_STATUS_LABELS[status] || status
  }