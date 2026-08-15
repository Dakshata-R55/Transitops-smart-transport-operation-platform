import { authFetch } from './apiClient'

// Backend returns "name" → your page expects "fullName"
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

// Your form → backend create request
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