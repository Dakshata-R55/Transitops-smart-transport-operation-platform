const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

let mockVehicles = [
  {
    id: 1,
    registrationNo: 'MH-12-AB-1234',
    name: 'City Bus 01',
    type: 'BUS',
    capacity: 45,
    odometer: 125000,
    acqCost: 2500000,
    status: 'ACTIVE',
  },
  {
    id: 2,
    registrationNo: 'MH-14-CD-5678',
    name: 'Delivery Van 02',
    type: 'VAN',
    capacity: 12,
    odometer: 85000,
    acqCost: 900000,
    status: 'IN_MAINTENANCE',
  },
  {
    id: 3,
    registrationNo: 'MH-20-EF-9012',
    name: 'Cargo Truck 03',
    type: 'TRUCK',
    capacity: 20,
    odometer: 95000,
    acqCost: 1800000,
    status: 'ACTIVE',
  },
]

const USE_MOCK = true

export async function createVehicle(vehicleData) {
  if (USE_MOCK) {
    const newVehicle = {
      id: mockVehicles.length + 1,
      ...vehicleData,
      capacity: Number(vehicleData.capacity),
      odometer: Number(vehicleData.odometer),
      acqCost: Number(vehicleData.acqCost),
    }
    mockVehicles = [...mockVehicles, newVehicle]
    return newVehicle
  }

  const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicleData),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Failed to add vehicle')
  return data
}

export async function getVehicles(filters = {}) {
  if (USE_MOCK) {
    return mockVehicles.filter((vehicle) => {
      const typeMatch = !filters.type || vehicle.type === filters.type
      const statusMatch = !filters.status || vehicle.status === filters.status
      return typeMatch && statusMatch
    })
  }

  const params = new URLSearchParams()
  if (filters.type) params.append('type', filters.type)
  if (filters.status) params.append('status', filters.status)

  const query = params.toString()
  const url = `${API_BASE_URL}/api/vehicles${query ? `?${query}` : ''}`

  const response = await fetch(url)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Failed to load vehicles')
  return data
}

// For Dispatcher trip form — only ACTIVE vehicles
export async function getAvailableVehicles() {
  return getVehicles({ status: 'ACTIVE' })
}