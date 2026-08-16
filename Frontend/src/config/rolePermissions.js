import { ROLES } from './roleSignupFields'

export const ROLE_LABELS = Object.fromEntries(
  ROLES.map((role) => [role.value, role.label])
)

export const ROLE_PERMISSIONS = {
  FLEET_MANAGER: [
    'Create and manage vehicles',
    'Create and complete maintenance records',
    'View maintenance records',
    'View drivers',
    'View dashboard KPIs',
    'View and update app settings',
    'View reports & analytics',
  ],
  SAFETY_OFFICER: [
    'Create and manage driver profiles',
    'View drivers',
    'View trips',
    'View dashboard KPIs',
    'View and update app settings',
  ],
  DISPATCHER: [
    'Create and update trip status',
    'View trips',
    'View vehicles, drivers, and maintenance',
    'View dashboard KPIs',
    'View and update app settings',
  ],
  FINANCIAL_ANALYST: [
    'Manage fuel logs and expenses',
    'View finance summary',
    'View vehicles',
    'View dashboard KPIs',
    'View and update app settings',
    'View reports & analytics',
  ],
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role || '-'
}

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || []
}