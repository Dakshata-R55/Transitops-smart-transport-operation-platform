import ThemeToggle from './ThemeToggle'
import '../Styles/auth.css'
import '../Styles/layout.css'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-theme-row">
          <ThemeToggle label="Theme" />
        </div>

        <h1>{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  )
}

export default AuthLayout