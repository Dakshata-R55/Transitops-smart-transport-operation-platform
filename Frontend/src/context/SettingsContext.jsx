import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
  } from 'react'
  import { useAuth } from './AuthContext'
  import { getSettings, updateSettings } from '../services/settingService'
  import {
    formatCurrency as formatCurrencyUtil,
    getCurrencySymbol,
  } from '../services/currencyService'
  
  const DEFAULT_SETTINGS = {
    depotName: '',
    currency: 'INR',
    currencyLabel: 'INR (Rs)',
    distanceUnit: 'Kilometers',
    supportedCurrencies: [],
  }
  
  const SettingsContext = createContext(null)
  
  export function SettingsProvider({ children }) {
    const { isAuthenticated } = useAuth()
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [isLoadingSettings, setIsLoadingSettings] = useState(false)
  
    const loadSettings = useCallback(async () => {
      if (!isAuthenticated) {
        setSettings(DEFAULT_SETTINGS)
        return
      }
  
      setIsLoadingSettings(true)
  
      try {
        const data = await getSettings()
        setSettings(data)
      } catch {
        setSettings(DEFAULT_SETTINGS)
      } finally {
        setIsLoadingSettings(false)
      }
    }, [isAuthenticated])
  
    useEffect(() => {
      loadSettings()
    }, [loadSettings])
  
    async function saveAppSettings({ depotName, currency }) {
      const updated = await updateSettings({ depotName, currency })
      setSettings(updated)
      return updated
    }
  
    function formatCurrency(value) {
      return formatCurrencyUtil(value, settings.currency)
    }
  
    const currencyCode = settings.currency
    const currencyLabel = settings.currencyLabel || settings.currency
    const currencySymbol = getCurrencySymbol(settings.currency)
  
    const value = {
      settings,
      currencyCode,
      currencyLabel,
      currencySymbol,
      isLoadingSettings,
      loadSettings,
      saveAppSettings,
      formatCurrency,
    }
  
    return (
      <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
    )
  }
  
  export function useSettings() {
    const context = useContext(SettingsContext)
    if (!context) {
      throw new Error('useSettings must be used inside SettingsProvider')
    }
    return context
  }