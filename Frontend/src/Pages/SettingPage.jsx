import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import AppLayout from '../Components/AppLayout'
import ThemeToggle from '../Components/ThemeToggle'
import {
  getRoleLabel,
  getPermissionsForRole,
  ROLE_PERMISSIONS,
} from '../config/rolePermissions'
import '../Styles/dashboard.css'
import '../Styles/vehicles.css'
import '../Styles/layout.css'

function SettingsPage() {
  const { user, role } = useAuth()
  const {
    settings,
    saveAppSettings,
    loadSettings,
    isLoadingSettings,
    formatCurrency,
    currencyCode,
  } = useSettings()

  const [depotName, setDepotName] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const myPermissions = getPermissionsForRole(role)

  useEffect(() => {
    if (!settings) return
    setDepotName(settings.depotName || '')
    setCurrency(settings.currency || 'INR')
  }, [settings])

  async function handleSaveSettings(event) {
    event.preventDefault()
    setPageError('')
    setSuccessMessage('')

    if (!depotName.trim()) {
      setPageError('Depot name is required')
      return
    }

    setIsSaving(true)

    try {
      await saveAppSettings({ depotName, currency })
      setSuccessMessage(
        'App settings saved successfully. Currency is now updated across the app.'
      )
    } catch (error) {
      setPageError(error.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppLayout
      title="Settings & RBAC"
      subtitle={`Logged in as ${user?.fullName || user?.email}`}
    >
      {pageError && <div className="form-error">{pageError}</div>}
      {successMessage && <div className="form-success">{successMessage}</div>}

      <div className="vehicles-container">
        <div className="vehicles-card">
          <h2>Your Account</h2>
          <div className="vehicle-details-grid">
            <div>
              <strong>Name</strong>
              <p>{user?.fullName || '-'}</p>
            </div>
            <div>
              <strong>Email</strong>
              <p>{user?.email || '-'}</p>
            </div>
            <div>
              <strong>Phone</strong>
              <p>{user?.phone || '-'}</p>
            </div>
            <div>
              <strong>Role</strong>
              <p>{getRoleLabel(role)}</p>
            </div>
          </div>
        </div>

        <div className="vehicles-card">
          <h2>Appearance</h2>
          <p className="auth-subtitle">
            Choose light (white) or dark (black) theme for the application.
          </p>
          <ThemeToggle label="Color Theme" />
        </div>

        <div className="vehicles-card">
          <h2>Your Permissions</h2>
          <p className="auth-subtitle">
            Based on your role, you can perform the following actions in Transitops.
          </p>

          {myPermissions.length === 0 ? (
            <p>No permissions configured for this role.</p>
          ) : (
            <ul className="settings-permission-list">
              {myPermissions.map((permission) => (
                <li key={permission}>{permission}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="vehicles-card">
          <h2>Role Access Overview</h2>
          <p className="auth-subtitle">
            Summary of what each role can access in the system.
          </p>

          <div className="settings-rbac-grid">
            {Object.entries(ROLE_PERMISSIONS).map(([roleKey, permissions]) => (
              <div key={roleKey} className="dashboard-card">
                <h3>{getRoleLabel(roleKey)}</h3>
                <ul className="settings-permission-list">
                  {permissions.map((permission) => (
                    <li key={permission}>{permission}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="vehicles-card">
          <h2>App Settings</h2>
          <p className="auth-subtitle">
            Depot and currency settings shared across the application.
          </p>
          <p className="auth-subtitle">
            Current currency preview: {formatCurrency(1234.56)}
          </p>

          {isLoadingSettings ? (
            <p>Loading settings...</p>
          ) : (
            <form className="vehicle-form" onSubmit={handleSaveSettings}>
              <div className="form-group">
                <label htmlFor="depotName">Depot Name</label>
                <input
                  id="depotName"
                  type="text"
                  value={depotName}
                  onChange={(event) => setDepotName(event.target.value)}
                  placeholder="Enter depot name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  {(settings?.supportedCurrencies || []).map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Distance Unit</label>
                <input
                  type="text"
                  value={settings?.distanceUnit || 'Kilometers'}
                  disabled
                />
                <p className="auth-subtitle">
                  Distance unit is configured on the server and shown here for reference.
                </p>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>

              <button
                type="button"
                className="auth-button"
                onClick={loadSettings}
                style={{ marginLeft: '8px' }}
              >
                Reload Settings
              </button>
            </form>
          )}

          <p className="auth-subtitle" style={{ marginTop: '12px' }}>
            Active currency code: {currencyCode}
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default SettingsPage