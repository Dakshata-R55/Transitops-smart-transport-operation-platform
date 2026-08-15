import { Link } from 'react-router-dom'

function DashboardPage() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <p className="auth-subtitle">
          You reached here after login. API integration comes next.
        </p>
        <Link to="/login" className="auth-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Back to Login
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage