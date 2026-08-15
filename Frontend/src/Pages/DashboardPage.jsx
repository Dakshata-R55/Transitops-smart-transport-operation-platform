import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const { user, role, logoutUser } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <p className="auth-subtitle">
          Welcome, {user?.fullName || user?.email}
        </p>
        <p className="auth-subtitle">Role: {role}</p>

        {role === 'FLEET_MANAGER' && (
          <Link
            to="/fleet/vehicles"
            className="auth-button"
            style={{ display: 'inline-block', textDecoration: 'none', marginBottom: '12px' }}
          >
            Manage Vehicles
          </Link>
        )}

        <button
          type="button"
          className="auth-button"
          onClick={handleLogout}
          style={{ display: 'block', width: '100%' }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default DashboardPage