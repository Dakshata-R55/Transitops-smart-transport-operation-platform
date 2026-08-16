import { authFetch } from './apiClient'

function mapSettingsFromApi(data) {
  return {
    depotName: data.depotName || '',
    currency: data.currency || 'INR',
    currencyLabel: data.currencyLabel || data.currency || '',
    distanceUnit: data.distanceUnit || 'Kilometers',
    supportedCurrencies: (data.supportedCurrencies || []).map((item) => ({
      code: item.code,
      label: item.label,
    })),
  }
}

export async function getSettings() {
  const data = await authFetch('/api/settings')
  return mapSettingsFromApi(data)
}

export async function updateSettings({ depotName, currency }) {
  const data = await authFetch('/api/settings', {
    method: 'PUT',
    body: JSON.stringify({
      depotName: depotName.trim(),
      currency,
    }),
  })
  return mapSettingsFromApi(data)
}