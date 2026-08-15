const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

let mockDrivers = [
  {
    id: 1,
    fullName: 'Rahul Sharma',
    licenseNumber: 'MH-12-2024-001',
    licenseCategory: 'HMV',
    licenseExpiryDate: '2027-06-30',
    contactNumber: '9876543210',
    safetyScore: 100,
    status: 'AVAILABLE',
  },
]

const USE_MOCK = true

export async function createDriver(driverData) {
  if (USE_MOCK) {
    const newDriver = {
      id: mockDrivers.length + 1,
      ...driverData,
      safetyScore: Number(driverData.safetyScore),
    }
    mockDrivers = [...mockDrivers, newDriver]
    return newDriver
  }

  const response = await fetch(`${API_BASE_URL}/api/drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(driverData),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Failed to create driver')
  return data
}

export async function getDrivers(filters = {}) {
  if (USE_MOCK) {
    return mockDrivers.filter((driver) => {
      const statusMatch = !filters.status || driver.status === filters.status
      const categoryMatch =
        !filters.licenseCategory || driver.licenseCategory === filters.licenseCategory
      return statusMatch && categoryMatch
    })
  }

  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.licenseCategory) params.append('licenseCategory', filters.licenseCategory)

  const query = params.toString()
  const url = `${API_BASE_URL}/api/drivers${query ? `?${query}` : ''}`

  const response = await fetch(url)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Failed to load drivers')
  return data
}