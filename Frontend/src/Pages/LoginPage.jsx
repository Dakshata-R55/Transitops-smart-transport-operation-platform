import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../Components/AuthLayout'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../config/roleSignupFields'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message
  const { loginUser } = useAuth()

  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const newErrors = {}

    if (!role) {
      newErrors.role = 'Please select your role'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const data = await login(email.trim(), password)

      if (data.role !== role) {
        setFormError(
          `This account is registered as ${formatRoleLabel(data.role)}, not ${formatRoleLabel(role)}.`
        )
        return
      }

      loginUser(data)
      navigate('/dashboard')
    } catch (error) {
      setFormError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function formatRoleLabel(roleValue) {
    return ROLES.find((r) => r.value === roleValue)?.label || roleValue
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Transitops account"
      footer={
        <>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-error">{formError}</div>}

        {successMessage && (
          <div
            className="form-error"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
          >
            {successMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="role">I am signing in as</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={errors.role ? 'input-error' : ''}
          >
            <option value="">Select your role</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage