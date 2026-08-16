const COMMON_NAV = [{ label: 'Settings', path: '/settings' }]

export const NAV_BY_ROLE = {
  FLEET_MANAGER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Vehicles', path: '/fleet/vehicles' },
    { label: 'Maintenance Log', path: '/fleet/maintenance' },
    { label: 'Reports & Analytics', path: '/reports/analytics' },
  ],
  SAFETY_OFFICER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Drivers', path: '/safety/drivers' },
  ],
  DISPATCHER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Trips', path: '/dispatcher/trips' },
  ],
  FINANCIAL_ANALYST: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Fuel & Expenses', path: '/finance/costs' },
    { label: 'Reports & Analytics', path: '/reports/analytics' },
  ],
}

export function getNavItemsForRole(role) {
  const roleItems =
    NAV_BY_ROLE[role] || [{ label: 'Dashboard', path: '/dashboard' }]
  return [...roleItems, ...COMMON_NAV]
}