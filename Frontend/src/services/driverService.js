import { authFetch } from './apiClient'

export const DRIVER_STATUS_LABELS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
}

// Statuses Safety Officer can set manually
export const SAFETY_OFFICER_STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OFF_DUTY', label: 'Off Duty' },
  { value: 'SUSPENDED', label: 'Suspended' },
]

function mapDriverFromApi(driver) {
  return {
    id: driver.id,
    fullName: driver.name,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiryDate: driver.licenseExpiryDate,
    contactNumber: driver.contactNumber,
    emergencyContact: driver.emergencyContact,
    safetyScore: driver.safetyScore,
    status: driver.status,
  }
}

function mapDriverToApi(driverData) {
  return {
    name: driverData.fullName,
    licenseNumber: driverData.licenseNumber,
    licenseCategory: driverData.licenseCategory,
    licenseExpiryDate: driverData.licenseExpiryDate,
    contactNumber: driverData.contactNumber,
    emergencyContact: driverData.emergencyContact || null,
  }
}

export function getDriverStatusLabel(status) {
  return DRIVER_STATUS_LABELS[status] || status
}

export async function createDriver(driverData) {
  const response = await authFetch('/api/drivers', {
    method: 'POST',
    body: JSON.stringify(mapDriverToApi(driverData)),
  })

  return mapDriverFromApi(response)
}

export async function getDrivers(filters = {}) {
  const drivers = await authFetch('/api/drivers')

  const mapped = drivers.map(mapDriverFromApi)

  return mapped.filter((driver) => {
    const statusMatch = !filters.status || driver.status === filters.status
    const categoryMatch =
      !filters.licenseCategory || driver.licenseCategory === filters.licenseCategory
    return statusMatch && categoryMatch
  })
}

export async function getAvailableDrivers() {
  const drivers = await getDrivers({ status: 'AVAILABLE' })
  return drivers
}

export async function updateDriverStatus(driverId, status) {
  const response = await authFetch(`/api/drivers/${driverId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

  return mapDriverFromApi(response)
}