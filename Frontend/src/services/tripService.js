const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const TRIP_STATUSES = ['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED']

// Allowed status changes
const STATUS_FLOW = {
  DRAFT: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

let mockTrips = [
  {
    id: 1,
    source: 'Mumbai Depot',
    destination: 'Pune Hub',
    vehicleId: 1,
    driverId: 1,
    cargoWeight: 1200,
    plannedDistance: 150,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
  },
]

const USE_MOCK = true

function canChangeStatus(currentStatus, nextStatus) {
  return STATUS_FLOW[currentStatus]?.includes(nextStatus)
}

export async function createTrip(tripData) {
  if (USE_MOCK) {
    const newTrip = {
      id: mockTrips.length + 1,
      ...tripData,
      cargoWeight: Number(tripData.cargoWeight),
      plannedDistance: Number(tripData.plannedDistance),
      vehicleId: Number(tripData.vehicleId),
      driverId: Number(tripData.driverId),
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    }
    mockTrips = [...mockTrips, newTrip]
    return newTrip
  }

  const response = await fetch(`${API_BASE_URL}/api/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Failed to create trip')
  return data
}

export async function getTrips(filters = {}) {
  if (USE_MOCK) {
    return mockTrips.filter((trip) => {
      return !filters.status || trip.status === filters.status
    })
  }

  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)

  const query = params.toString()
  const url = `${API_BASE_URL}/api/trips${query ? `?${query}` : ''}`

  const response = await fetch(url)
  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Failed to load trips')
  return data
}

export async function updateTripStatus(tripId, nextStatus) {
  if (USE_MOCK) {
    const trip = mockTrips.find((t) => t.id === tripId)
    if (!trip) throw new Error('Trip not found')
    if (!canChangeStatus(trip.status, nextStatus)) {
      throw new Error(`Cannot change status from ${trip.status} to ${nextStatus}`)
    }
    trip.status = nextStatus
    return trip
  }

  const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: nextStatus }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Failed to update trip status')
  return data
}