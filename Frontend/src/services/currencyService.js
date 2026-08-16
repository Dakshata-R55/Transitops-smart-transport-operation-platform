export const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'Dh',
    JPY: '¥',
  }
  
  export function getCurrencySymbol(currencyCode = 'INR') {
    return CURRENCY_SYMBOLS[currencyCode] || currencyCode
  }
  
  export function formatMoney(value) {
    const number = Number(value || 0)
    return number.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  
  export function formatCurrency(value, currencyCode = 'INR') {
    const number = Number(value || 0)
  
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number)
    } catch {
      return `${getCurrencySymbol(currencyCode)} ${formatMoney(value)}`
    }
  }