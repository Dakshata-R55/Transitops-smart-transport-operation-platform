import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>Access Denied</h1>
        <p className="auth-subtitle">
          You do not have permission to view this page.
        </p>
        <Link
          to="/dashboard"
          className="auth-button"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedPage