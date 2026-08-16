import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../Components/AuthLayout'
import { signup } from '../services/authService'
import { ROLES, ROLE_FIELDS } from '../config/roleSignupFields'

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  employeeId: '',
  company: '',
  fleetSize: '',
  locationBranch: '',
  safetyCertification: '',
  departmentBranch: '',
  department: '',
}

function SignUpPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState('FLEET_MANAGER')
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleRoleChange(newRole) {
    setRole(newRole)
    setErrors({})
  }

  function validate() {
    const newErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    const fields = ROLE_FIELDS[role] || []

    for (const field of fields) {
      const rawValue = form[field.name]
      const value =
        typeof rawValue === 'string' ? rawValue.trim() : rawValue ?? ''

      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`
      }

      if (field.type === 'email' && value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.name] = 'Enter a valid email address'
        }
      }

      if (field.type === 'tel' && value) {
        const digits = value.replace(/\D/g, '')
        if (digits.length !== 10) {
          newErrors[field.name] = 'Enter a valid 10-digit number'
        }
      }

      if (field.type === 'number' && value && Number(value) <= 0) {
        newErrors[field.name] = 'Enter a valid fleet size'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function buildPayload() {
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      role,
    }

    if (role === 'FLEET_MANAGER') {
      payload.fleetManagerProfile = {
        employeeId: form.employeeId.trim(),
        company: form.company.trim(),
        fleetSize: Number(form.fleetSize),
        branch: form.locationBranch.trim(),
      }
    }

    if (role === 'SAFETY_OFFICER') {
      payload.safetyOfficerProfile = {
        employeeId: form.employeeId.trim(),
        company: form.company.trim(),
        certification: form.safetyCertification.trim() || null,
        department: form.departmentBranch.trim(),
      }
    }

    if (role === 'FINANCIAL_ANALYST') {
      payload.financialAnalystProfile = {
        employeeId: form.employeeId.trim(),
        company: form.company.trim(),
        department: form.department.trim(),
      }
    }

    return payload
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!validate()) return

    setIsSubmitting(true)

    try {
      await signup(buildPayload())
      navigate('/login', {
        state: { message: 'Account created successfully. Please sign in.' },
      })
    } catch (error) {
      setFormError(error.message || 'Sign up failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderField(field) {
    const value = form[field.name] ?? ''

    return (
      <div className="form-group" key={field.name}>
        <label htmlFor={field.name}>
          {field.label}
          {!field.required && ' (optional)'}
        </label>
        <input
          id={field.name}
          type={field.type}
          value={value}
          onChange={(e) => {
            let val = e.target.value
            if (field.type === 'tel') {
              val = val.replace(/\D/g, '').slice(0, 10)
            }
            updateField(field.name, val)
          }}
          className={errors[field.name] ? 'input-error' : ''}
        />
        {errors[field.name] && (
          <span className="field-error">{errors[field.name]}</span>
        )}
      </div>
    )
  }

  const selectedRoleLabel =
    ROLES.find((r) => r.value === role)?.label ?? 'Role'

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
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <p className="form-section-title">{selectedRoleLabel} details</p>

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Alex Kumar"
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className={errors.fullName ? 'input-error' : ''}
          />
          {errors.fullName && (
            <span className="field-error">{errors.fullName}</span>
          )}
        </div>

        {ROLE_FIELDS[role].map((field) => renderField(field))}

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
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