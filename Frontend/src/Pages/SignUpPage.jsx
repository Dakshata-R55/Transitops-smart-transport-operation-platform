import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../Components/AuthLayout'
import { signup } from '../services/authService'

const ROLES = [
  { value: 'FLEET_MANAGER', label: 'Fleet Manager' },
  { value: 'DRIVER', label: 'Driver' },
  { value: 'SAFETY_OFFICER', label: 'Safety Officer' },
  { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
]

function SignUpPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('DRIVER')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const newErrors = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!role) {
      newErrors.role = 'Please select a role'
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
      await signup({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
      })

      // Success → go to login
      navigate('/login', {
        state: { message: 'Account created successfully. Please sign in.' },
      })
    } catch (error) {
      setFormError(error.message || 'Sign up failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Transitops to manage transit operations"
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-error">{formError}</div>}

        <div className="form-group">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Alex Kumar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={errors.fullName ? 'input-error' : ''}
          />
          {errors.fullName && (
            <span className="field-error">{errors.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="alex@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={errors.role ? 'input-error' : ''}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignUpPage