export const NAV_BY_ROLE = {
    FLEET_MANAGER: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Vehicles', path: '/fleet/vehicles' },
      { label: 'Maintenance Log', path: '/fleet/maintenance' },
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
    ],
  }
  
  export function getNavItemsForRole(role) {
    return NAV_BY_ROLE[role] || [{ label: 'Dashboard', path: '/dashboard' }]
  }