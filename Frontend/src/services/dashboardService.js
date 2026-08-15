import { getVehicles } from './vehicleService'
import { getDrivers } from './driverService'
import { getTrips } from './tripService'

export const VEHICLE_TYPES = ['BUS', 'TRUCK', 'VAN', 'MINI_BUS']

export const VEHICLE_STATUSES = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']

export const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Other']

const REGION_BY_PREFIX = {
  DL: 'North',
  HR: 'North',
  PB: 'North',
  UP: 'North',
  MH: 'West',
  GJ: 'West',
  GA: 'West',
  KA: 'South',
  TN: 'South',
  KL: 'South',
  AP: 'South',
  TS: 'South',
  WB: 'East',
  OD: 'East',
  BH: 'East',
  MP: 'Central',
  RJ: 'Central',
  CG: 'Central',
}

function getRegionFromRegistration(registrationNo = '') {
  const prefix = registrationNo.slice(0, 2).toUpperCase()
  return REGION_BY_PREFIX[prefix] || 'Other'
}

function enrichVehicle(vehicle) {
  return {
    ...vehicle,
    region: getRegionFromRegistration(vehicle.registrationNo),
  }
}

function applyVehicleFilters(vehicles, filters = {}) {
  return vehicles
    .map(enrichVehicle)
    .filter((vehicle) => {
      const typeMatch = !filters.type || vehicle.type === filters.type
      const statusMatch = !filters.status || vehicle.status === filters.status
      const regionMatch = !filters.region || vehicle.region === filters.region
      return typeMatch && statusMatch && regionMatch
    })
}

export function computeDashboardKpis(vehicles, drivers, trips, filters = {}) {
  const filteredVehicles = applyVehicleFilters(vehicles, filters)
  const filteredVehicleIds = new Set(filteredVehicles.map((vehicle) => vehicle.id))

  const filteredTrips = trips.filter((trip) =>
    filteredVehicleIds.has(Number(trip.vehicleId))
  )

  const activeVehicles = filteredVehicles.filter(
    (vehicle) => vehicle.status !== 'RETIRED'
  )
  const availableVehicles = filteredVehicles.filter(
    (vehicle) => vehicle.status === 'AVAILABLE'
  )
  const vehiclesInMaintenance = filteredVehicles.filter(
    (vehicle) => vehicle.status === 'IN_SHOP'
  )
  const vehiclesOnTrip = filteredVehicles.filter(
    (vehicle) => vehicle.status === 'ON_TRIP'
  )

  const activeTrips = filteredTrips.filter((trip) => trip.status === 'DISPATCHED')
  const pendingTrips = filteredTrips.filter((trip) => trip.status === 'DRAFT')
  const driversOnDuty = drivers.filter((driver) => driver.status === 'ON_TRIP')

  const fleetUtilization =
    activeVehicles.length === 0
      ? 0
      : Math.round((vehiclesOnTrip.length / activeVehicles.length) * 100)

  return {
    activeVehicles: activeVehicles.length,
    availableVehicles: availableVehicles.length,
    vehiclesInMaintenance: vehiclesInMaintenance.length,
    activeTrips: activeTrips.length,
    pendingTrips: pendingTrips.length,
    driversOnDuty: driversOnDuty.length,
    fleetUtilization,
  }
}

export async function fetchDashboardData() {
  const [vehiclesResult, driversResult, tripsResult] = await Promise.allSettled([
    getVehicles(),
    getDrivers(),
    getTrips(),
  ])

  return {
    vehicles: vehiclesResult.status === 'fulfilled' ? vehiclesResult.value : [],
    drivers: driversResult.status === 'fulfilled' ? driversResult.value : [],
    trips: tripsResult.status === 'fulfilled' ? tripsResult.value : [],
    loadErrors: [
      vehiclesResult.status === 'rejected' ? 'Vehicles data unavailable for your role.' : null,
      driversResult.status === 'rejected' ? 'Drivers data unavailable for your role.' : null,
      tripsResult.status === 'rejected' ? 'Trips data unavailable.' : null,
    ].filter(Boolean),
  }
}