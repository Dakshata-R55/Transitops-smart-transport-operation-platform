export const SERVICE_TYPES = [
    { value: 'ENGINE_SERVICE', label: 'Engine Service' },
    { value: 'BRAKE_REPAIR', label: 'Brake Repair' },
    { value: 'TIRE_REPLACEMENT', label: 'Tire Replacement' },
    { value: 'OIL_CHANGE', label: 'Oil Change' },
    { value: 'ELECTRICAL_REPAIR', label: 'Electrical Repair' },
    { value: 'BODY_REPAIR', label: 'Body Repair' },
    { value: 'AC_REPAIR', label: 'AC Repair' },
    { value: 'GENERAL_INSPECTION', label: 'General Inspection' },
    { value: 'OTHER', label: 'Other' },
  ]
  
  export function getServiceTypeLabel(value) {
    const match = SERVICE_TYPES.find((item) => item.value === value)
    return match ? match.label : value
  }