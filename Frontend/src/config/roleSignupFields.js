export const ROLES = [
    { value: 'FLEET_MANAGER', label: 'Fleet Manager' },
    { value: 'DRIVER', label: 'Driver' },
    { value: 'SAFETY_OFFICER', label: 'Safety Officer' },
    { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
  ]
  
  // Fields shown for EVERY role
  export const COMMON_FIELDS = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
  ]
  
  // Extra fields per role (shown after role is selected)
  export const ROLE_FIELDS = {
    FLEET_MANAGER: [
      { name: 'email', label: 'Work Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { name: 'company', label: 'Company / Organization', type: 'text', required: true },
      { name: 'fleetSize', label: 'Fleet Size', type: 'number', required: true },
      { name: 'locationBranch', label: 'Location / Branch', type: 'text', required: true },
    ],
  
    DRIVER: [
      { name: 'email', label: 'Work Email', type: 'email', required: false },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
      { name: 'employeeId', label: 'Employee ID / Driver ID', type: 'text', required: true },
      { name: 'drivingLicenseNumber', label: 'Driving License Number', type: 'text', required: true },
      { name: 'licenseExpiryDate', label: 'License Expiry Date', type: 'date', required: true },
      { name: 'vehicleAssigned', label: 'Vehicle Assigned', type: 'text', required: false },
      { name: 'emergencyContact', label: 'Emergency Contact', type: 'tel', required: true },
    ],
  
    SAFETY_OFFICER: [
      { name: 'email', label: 'Work Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { name: 'company', label: 'Company / Organization', type: 'text', required: true },
      { name: 'safetyCertification', label: 'Safety Certification', type: 'text', required: false },
      { name: 'departmentBranch', label: 'Department / Branch', type: 'text', required: true },
    ],
  
    FINANCIAL_ANALYST: [
      { name: 'email', label: 'Work Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { name: 'company', label: 'Company / Organization', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'text', required: true },
      { name: 'financeId', label: 'Employee / Finance ID', type: 'text', required: true },
    ],
  }