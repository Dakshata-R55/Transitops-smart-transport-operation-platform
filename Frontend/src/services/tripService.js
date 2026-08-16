import { authFetch } from './apiClient'

export const TRIP_STATUSES = ['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED']

const USE_MOCK = false

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

const STATUS_FLOW = {
  DRAFT: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

function canChangeStatus(currentStatus, nextStatus) {
  return STATUS_FLOW[currentStatus]?.includes(nextStatus)
}

function mapTripToApi(tripData) {
  return {
    source: tripData.source,
    destination: tripData.destination,
    vehicleId: Number(tripData.vehicleId),
    driverId: Number(tripData.driverId),
    cargoWeight: Number(tripData.cargoWeight),
    plannedDistance: Number(tripData.plannedDistance),
  }
}

export async function createTrip(tripData) {
  if (USE_MOCK) {
    const newTrip = {
      id: mockTrips.length + 1,
      ...mapTripToApi(tripData),
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    }
    mockTrips = [...mockTrips, newTrip]
    return newTrip
  }

  return authFetch('/api/trips', {
    method: 'POST',
    body: JSON.stringify(mapTripToApi(tripData)),
  })
}

export async function getTrips(filters = {}) {
  if (USE_MOCK) {
    return mockTrips.filter((trip) => {
      return !filters.status || trip.status === filters.status
    })
  }

  const query = filters.status ? `?status=${filters.status}` : ''
  return authFetch(`/api/trips${query}`)
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

  return authFetch(`/api/trips/${tripId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: nextStatus }),
  })
}