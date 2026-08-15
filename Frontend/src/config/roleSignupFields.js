export const ROLES = [
    { value: 'FLEET_MANAGER', label: 'Fleet Manager' },
    { value: 'DISPATCHER', label: 'Dispatcher' },
    { value: 'SAFETY_OFFICER', label: 'Safety Officer' },
    { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
  ]
  
  export const COMMON_FIELDS = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
  ]
  
  export const ROLE_FIELDS = {
    FLEET_MANAGER: [
      { name: 'email', label: 'Work Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { name: 'company', label: 'Company / Organization', type: 'text', required: true },
      { name: 'fleetSize', label: 'Fleet Size', type: 'number', required: true },
      { name: 'locationBranch', label: 'Location / Branch', type: 'text', required: true },
    ],
  
    // Dispatcher — simple signup only
    DISPATCHER: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
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