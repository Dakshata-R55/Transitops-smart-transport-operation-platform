import { authFetch } from './apiClient'

export const VEHICLE_TYPES = ['BUS', 'TRUCK', 'VAN', 'MINI_BUS']

export const VEHICLE_STATUSES = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP',]

export const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Other']

const EMPTY_KPIS = {
  activeVehicles: 0,
  availableVehicles: 0,
  vehiclesInMaintenance: 0,
  activeTrips: 0,
  pendingTrips: 0,
  driversOnDuty: 0,
  fleetUtilization: 0,
}

function buildQuery(filters = {}) {
  const params = new URLSearchParams()
  if (filters.type) params.set('type', filters.type)
  if (filters.status) params.set('status', filters.status)
  if (filters.region) params.set('region', filters.region)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export async function fetchDashboardKpis(filters = {}) {
  const data = await authFetch(`/api/dashboard${buildQuery(filters)}`)

  return {
    activeVehicles: data.activeVehicles ?? EMPTY_KPIS.activeVehicles,
    availableVehicles: data.availableVehicles ?? EMPTY_KPIS.availableVehicles,
    vehiclesInMaintenance:
      data.vehiclesInMaintenance ?? EMPTY_KPIS.vehiclesInMaintenance,
    activeTrips: data.activeTrips ?? EMPTY_KPIS.activeTrips,
    pendingTrips: data.pendingTrips ?? EMPTY_KPIS.pendingTrips,
    driversOnDuty: data.driversOnDuty ?? EMPTY_KPIS.driversOnDuty,
    fleetUtilization: data.fleetUtilization ?? EMPTY_KPIS.fleetUtilization,
  }
}