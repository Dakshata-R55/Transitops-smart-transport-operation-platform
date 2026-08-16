import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNavItemsForRole } from '../config/roleNavigation'
import '../Styles/layout.css'

function AppLayout({ title, subtitle, children }) {
  const { user, role, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = getNavItemsForRole(role)

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <h2>Transitops</h2>
          <div className="sidebar-user">{user?.fullName || user?.email}</div>
          <div className="sidebar-role">Role: {role}</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? 'sidebar-link active'
                  : 'sidebar-link'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="auth-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="app-main-content">{children}</div>
      </main>
    </div>
  )
}

export default AppLayout